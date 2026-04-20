import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { err } from '$lib/server/entities/errors'
import { groupDeleteUseCase } from '$lib/server/application/use_cases/groups/delete'

export const groupDeleteController = async ({
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
	return await groupDeleteUseCase({
		id,
		group_repository: getGroupsRepositoryModule(),
		session
	})
}
