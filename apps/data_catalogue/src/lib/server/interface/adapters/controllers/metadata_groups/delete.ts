import { getGroupsServiceModule } from '$lib/server/modules/groups'
import { err } from '$lib/server/entities/errors'
import { metadataGroupDeleteUseCase } from '$lib/server/application/use_cases/metadata_groups/delete'

export const metadataGroupDeleteController = async ({
	id,
	session
}: {
	id?: string
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an id', id: 'missing-id' })
	}
	return await metadataGroupDeleteUseCase({
		id,
		group_service: getGroupsServiceModule(),
		session
	})
}
