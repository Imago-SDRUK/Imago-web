import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { err } from '$lib/server/entities/errors'
import { groupCreateUseCase } from '$lib/server/application/use_cases/groups/create'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'

export const groupCreateController = async ({
	data,
	session,
	configuration
}: {
	data: unknown
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	return await groupCreateUseCase({
		data,
		groups_repository: getGroupsRepositoryModule(),
		...getServerContext({ session, configuration })
	})
}
