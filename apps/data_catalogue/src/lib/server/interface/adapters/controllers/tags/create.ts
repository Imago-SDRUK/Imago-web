import { getServerContext } from '$lib/server/application/context'
import { tagCreateUseCase } from '$lib/server/application/use_cases/tags/create'
import { err } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getTagsModule } from '$lib/server/modules/tags'

export const tagsCreateController = async ({
	tag,
	session,
	vocabulary_id = 'general',
	configuration
}: {
	tag: string
	session: App.Locals['session']
	vocabulary_id?: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tags = await tagCreateUseCase({
		tag,
		vocabulary_id,
		tags_service: getTagsModule(),
		...getServerContext({ session, configuration })
	})
	return tags
}
