import { tagCreateUseCase } from '$lib/server/application/use_cases/tags/create'
import { err } from '$lib/server/entities/errors'
import { getTagsModule } from '$lib/server/modules/tags'

export const tagsCreateController = async ({
	tag,
	session,
	vocabulary_id = 'general'
}: {
	tag: string
	session: App.Locals['session']
	vocabulary_id?: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tags = await tagCreateUseCase({
		session,
		tag,
		vocabulary_id,
		tags_service: getTagsModule()
	})
	return tags
}
