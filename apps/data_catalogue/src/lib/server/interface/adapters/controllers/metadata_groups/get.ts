import { err, ok } from '$lib/server/entities/errors'
import type { GroupService } from '$lib/server/entities/models/groups'
import { getGroupsServiceModule } from '$lib/server/modules/groups'
import {
	metadataGroupGetPublicUseCase,
	metadataGroupGetUseCase,
	metadataGroupsGetPublicUseCase,
	metadataGroupsGetUseCase
} from '$lib/server/application/use_cases/metadata_groups/get'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'

const presenter = ({ group }: { group: GroupService }) => group

export const metadataGroupGetController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	id?: string
	configuration: Configuration
}) => {
	if (!id) {
		return err({ reason: 'Invalid Data', message: `You need to provide a group`, id: '' })
	}
	if (!session) {
		const [errors, group] = await metadataGroupGetPublicUseCase({
			id: id,
			groups_service: getGroupsServiceModule()
		})
		if (errors !== null) {
			return err(errors)
		}
		return ok(group)
	}
	const [errors, group] = await metadataGroupGetUseCase({
		id: id,
		groups_service: getGroupsServiceModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(presenter({ group }))
}

export const metadataGroupsGetController = async ({
	session,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		const [errors, groups] = await metadataGroupsGetPublicUseCase({
			groups_service: getGroupsServiceModule()
		})
		if (errors === null) {
			return ok(groups)
		}
		return err(errors)
	}
	const [errors, groups] = await metadataGroupsGetUseCase({
		groups_service: getGroupsServiceModule(),
		...getServerContext({ session, configuration })
	})
	if (errors === null) {
		return ok(groups)
	}
	return err(errors)
}
