import { err, ok } from '$lib/server/entities/errors'
import type { GroupService } from '$lib/server/entities/models/groups'
import { getGroupsServiceModule } from '$lib/server/modules/groups'
import {
	metadataGroupGetPublicUseCase,
	metadataGroupGetUseCase,
	metadataGroupsGetPublicUseCase,
	metadataGroupsGetUseCase
} from '$lib/server/application/use_cases/metadata_groups/get'

const presenter = ({ group }: { group: GroupService }) => group

export const metadataGroupGetController = async ({
	session,
	id
}: {
	session: App.Locals['session']
	id?: string
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
		session: session,
		groups_service: getGroupsServiceModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(presenter({ group }))
}

export const metadataGroupsGetController = async ({
	session
}: {
	session: App.Locals['session']
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
		session: session,
		groups_service: getGroupsServiceModule()
	})
	if (errors === null) {
		return ok(groups)
	}
	return err(errors)
}
