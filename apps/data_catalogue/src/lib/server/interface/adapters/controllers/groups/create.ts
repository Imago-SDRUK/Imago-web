import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { err } from '$lib/server/entities/errors'
import { groupCreateUseCase } from '$lib/server/application/use_cases/groups/create'

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
	return await groupCreateUseCase({
		data,
		groups_repository: getGroupsRepositoryModule(),
		session
	})
}
