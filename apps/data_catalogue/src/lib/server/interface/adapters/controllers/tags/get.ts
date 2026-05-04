import { getServerContext } from '$lib/server/application/context'
import {
	tagsGetCountPublicUseCase,
	tagsGetPublicUseCase,
	tagsGetUseCase,
	tagsGetVocabularyPublicUseCase
} from '$lib/server/application/use_cases/tags/get'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getTagsModule } from '$lib/server/modules/tags'

export const tagsGetController = async ({
	offset,
	limit,
	search,
	vocabulary_id,
	session,
	configuration
}: {
	offset?: number
	limit?: number
	search?: string
	vocabulary_id?: string
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		const [errors, tags] = await tagsGetPublicUseCase({
			offset,
			limit,
			search,
			vocabulary_id,
			tags_service: getTagsModule()
		})
		if (errors === null) {
			return ok(tags)
		}
		return err(errors)
	}
	const [errors, tags] = await tagsGetUseCase({
		offset,
		limit,
		search,
		vocabulary_id,
		tags_service: getTagsModule(),
		...getServerContext({ session, configuration })
	})

	if (errors === null) {
		return ok(tags)
	}
	return err(errors)
}

export const tagsGetCountController = async () => {
	const [errors, tags] = await tagsGetCountPublicUseCase({ tags_service: getTagsModule() })

	if (errors !== null) {
		return err(errors)
	}
	return ok(tags)
}

export const tagsGetVocabulariesController = async () => {
	const [errors, vocabularies] = await tagsGetVocabularyPublicUseCase({
		tags_service: getTagsModule()
	})

	if (errors !== null) {
		return err(errors)
	}
	return ok(vocabularies)
}
