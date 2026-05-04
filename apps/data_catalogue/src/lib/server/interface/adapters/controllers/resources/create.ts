import type {
	ResourceServiceRequest,
	ResourceVersionRequest
} from '$lib/server/entities/models/resources'
import { getResourceRepositoryModule } from '$lib/server/modules/resources'
import {
	resourceCreateUseCase,
	resourceServiceCreateUseCase,
	resourceVersionPipelineCreateUseCase
} from '$lib/server/application/use_cases/resources/create'
import { getResourceServiceModule } from '$lib/server/modules/resources_service'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { log } from '$lib/utils/server/logger'
import { getTransactionModule } from '$lib/server/modules/transaction'
import { getStorageModule } from '$lib/server/modules/storage'
import { resourceServiceDeleteUseCase } from '$lib/server/application/use_cases/resources/delete'
import { getDatastoreModule } from '$lib/server/modules/datastore'
import { permissionsCreateUseCase } from '$lib/server/application/use_cases/permissions/create'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const resourceCreateController = async ({
	session,
	data,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	data: ResourceServiceRequest
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [rs_errors, rs] = await resourceServiceCreateUseCase({
				data,
				resource_service: getResourceServiceModule(),
				...getServerContext({ session, configuration, tx })
			})
			if (rs_errors !== null) {
				return err(rs_errors)
			}
			const [errors, res] = await resourceCreateUseCase({
				package_id: rs.package_id,
				resource_respository: getResourceRepositoryModule(),
				data: { title: rs.name, id: rs.id, description: rs.description },
				...getServerContext({ session, configuration, tx })
			})
			if (errors !== null) {
				log.error({ caller: 'resourceCreateController', errors })
				tx.rollback()
				return err(errors)
			}
			return ok(res)
		}
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(results)
}

export const resourceCreateControllerWithVersion = async ({
	session,
	data,
	configuration,
	version_data
}: {
	session: App.Locals['session']
	configuration: Configuration
	data: ResourceServiceRequest
	version_data: Partial<ResourceVersionRequest>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [rs_errors, rs] = await resourceServiceCreateUseCase({
				data,
				resource_service: getResourceServiceModule(),
				...getServerContext({ session, configuration, tx })
			})
			if (rs_errors !== null) {
				return err(rs_errors)
			}
			const package_id = rs.package_id
			const [errors, res] = await resourceCreateUseCase({
				package_id: rs.package_id,
				resource_respository: getResourceRepositoryModule(),
				data: { title: rs.name, id: rs.id, description: rs.description },
				...getServerContext({ session, configuration, tx })
			})
			if (errors !== null) {
				log.error({ caller: 'resourceCreateControllerWithVersion', errors })
				const [rs_errors] = await resourceServiceDeleteUseCase({
					id: rs.id,
					datastore_service: getDatastoreModule(),
					resource_service: getResourceServiceModule(),
					...getServerContext({ session, configuration, tx })
				})
				if (rs_errors !== null) {
					log.error({ error: rs_errors, message: 'error rolling back ckan resource' })
					return err(rs_errors)
				}
				// {"namespace":"Resource","object":"019dcf95-e781-727d-b1e7-0a40826e709e","relation":"datasets","actor":"3345490f-5b94-40fa-b9f3-03e09221154f"}
				tx.rollback()
				return err(errors)
			}
			const [v_errors, version] = await resourceVersionPipelineCreateUseCase({
				resource_respository: getResourceRepositoryModule(),
				data: { ...version_data, resource: res.id },
				storage_service: getStorageModule(),
				...getServerContext({ session, configuration, tx })
			})
			if (v_errors !== null) {
				log.error({ caller: 'resourceCreateControllerWithVersion', errors })
				const [rs_errors] = await resourceServiceDeleteUseCase({
					id: rs.id,
					datastore_service: getDatastoreModule(),
					resource_service: getResourceServiceModule(),
					...getServerContext({ session, configuration, tx })
				})
				if (rs_errors !== null) {
					log.error({ error: rs_errors, message: 'error rolling back ckan resource' })
					return err(rs_errors)
				}
				try {
					tx.rollback()
				} catch (_err) {
					log.error({ error: _err, message: 'IGNORE' })
				}
				return err(v_errors)
			}
			const [errors_p] = await permissionsCreateUseCase({
				data: [
					{
						namespace: 'Resource',
						object: res.id,
						relation: 'datasets',
						actor: {
							namespace: 'Dataset',
							object: package_id,
							relation: ''
						}
					},
					{
						namespace: 'ResourceVersion',
						object: version.version.id,
						relation: 'resources',
						actor: {
							namespace: 'Resource',
							object: res.id,
							relation: ''
						}
					}
				],
				...getServerContext({ session, configuration, tx })
			})
			if (errors_p) {
				return err(errors_p)
			}
			return ok(version)
		}
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(results)
}
