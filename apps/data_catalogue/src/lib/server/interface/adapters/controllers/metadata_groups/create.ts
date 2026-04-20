import { getGroupsServiceModule } from '$lib/server/modules/groups'
import { err } from '$lib/server/entities/errors'
import { metadataGroupCreateUseCase } from '$lib/server/application/use_cases/metadata_groups/create'

export const groupCreateController = async ({
	data,
	session
}: {
	data: unknown
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	return await metadataGroupCreateUseCase({
		data,
		groups_service: getGroupsServiceModule(),
		session
	})
}
