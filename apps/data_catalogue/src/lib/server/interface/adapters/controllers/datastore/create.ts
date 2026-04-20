import type { Session } from '$lib/server/entities/models/identity'
import { getDatastoreModule } from '$lib/server/modules/datastore'
import { datastoreCreateUseCase } from '$lib/server/application/use_cases/datastore/create'
import type { CSVW } from '$lib/types/csvw'
import { err } from '$lib/server/entities/errors'

export const datastoreCreateController = async ({
	resource_id,
	session,
	metadata
}: {
	resource_id?: string
	session?: Session
	metadata?: Record<PropertyKey, unknown> | CSVW
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!resource_id || typeof resource_id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a dataset ID`, id: 'no-id' })
	}
	if (!metadata) {
		return err({
			reason: 'Invalid Data',
			message: `You need to provide valid structural metadata`,
			id: 'no-id'
		})
	}
	if ('@context' in metadata !== true) {
		return err({
			reason: 'Invalid Data',
			message: 'Structural metadata must include @context',
			id: 'invalid-file'
		})
	}
	if ('@type' in metadata !== true) {
		return err({
			reason: 'Invalid Data',
			message: 'Structural metadata must include @type',
			id: 'invalid-file'
		})
	}
	if ('tables' in metadata !== true) {
		return err({
			reason: 'Invalid Data',
			message: 'Structural metadata must include tables',
			id: 'invalid-file'
		})
	}

	return await datastoreCreateUseCase({
		resource_id,
		session,
		datastore_service: getDatastoreModule(),
		metadata
	})
}
