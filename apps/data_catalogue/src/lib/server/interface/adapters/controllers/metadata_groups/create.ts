import { getGroupsServiceModule } from '$lib/server/modules/groups'
import { err } from '$lib/server/entities/errors'
import { metadataGroupCreateUseCase } from '$lib/server/application/use_cases/metadata_groups/create'
import { getServerContext } from '$lib/server/application/context'
import type { Configuration } from '$lib/server/entities/models/configuration'

export const metadataGroupCreateController = async ({
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
	return await metadataGroupCreateUseCase({
		data,
		groups_service: getGroupsServiceModule(),
		...getServerContext({ session, configuration })
	})
}
