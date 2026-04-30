import { getGroupsServiceModule } from '$lib/server/modules/groups'
import { err } from '$lib/server/entities/errors'
import { metadataGroupDeleteUseCase } from '$lib/server/application/use_cases/metadata_groups/delete'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'

export const metadataGroupDeleteController = async ({
	id,
	session,
	configuration
}: {
	id?: string
	session: App.Locals['session']
	configuration: Configuration
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
		...getServerContext({ session, configuration })
	})
}
