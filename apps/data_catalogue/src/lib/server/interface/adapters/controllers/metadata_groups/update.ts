import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { err } from '$lib/server/entities/errors'
import { groupUpdateUseCase } from '$lib/server/application/use_cases/groups/update'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'

export const metadataGroupUpdateController = async ({
	id,
	data,
	session,
	configuration
}: {
	id?: string
	data: unknown
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an id', id: 'id' })
	}
	return await groupUpdateUseCase({
		id,
		data,
		groups_repository: getGroupsRepositoryModule(),
		...getServerContext({ session, configuration })
	})
}
