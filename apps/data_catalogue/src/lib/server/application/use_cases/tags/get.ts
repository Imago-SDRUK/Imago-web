import type { TagsService } from '$lib/server/application/services/tags'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import type { Session } from '$lib/server/entities/models/identity'

export const tagsGetUseCase = async ({
	limit = 10,
	offset = 0,
	search,
	// session,
	tags_service,
	vocabulary_id
}: {
	tags_service: TagsService
	limit?: number
	offset?: number
	search?: string
	vocabulary_id?: string
	session: Session
}) => {
	// NOTE: tags are always public until refactor?
	// const [errors, permission] = await getAuthorisationModule().authorise({
	// 	namespace: 'Action',
	// 	object: 'datasets',
	// 	permits: 'read',
	// 	actor: session.identity.id
	// })
	// if (errors) {
	// 	return err(errors)
	// }
	// if (!permission.allowed) {
	// 	return err({ reason: 'Unauthorised' })
	// }
	return await tags_service.getTags({
		limit,
		offset: offset,
		search,
		vocabulary_id
	})
}

export const tagsGetPublicUseCase = async ({
	limit = 10,
	offset = 0,
	search,
	tags_service,
	vocabulary_id
}: {
	tags_service: TagsService
	limit?: number
	offset?: number
	search?: string
	vocabulary_id?: string
}) => {
	return await tags_service.getTags({
		limit,
		offset: offset,
		search,
		vocabulary_id
	})
}

export const tagsGetCountPublicUseCase = async ({
	tags_service
}: {
	tags_service: TagsService
}) => {
	const [errors, vocabularies] = await tags_service.getVocabularies()
	if (errors !== null) {
		return err(errors)
	}
	const [nonv_errors, non_vocabulary_tags] = await tags_service.getTags({ limit: 9999, offset: 0 })
	if (nonv_errors !== null) {
		return err(nonv_errors)
	}
	const tags = await Promise.all(
		vocabularies.map((vocabulary) =>
			tags_service.getTags({
				limit: 9999,
				offset: 0,
				vocabulary_id: vocabulary.id
			})
		)
	)
	const count = tags.reduce(
		(acc, [errors, tags]) => {
			if (errors !== null) {
				acc.errors.push(errors)
			}
			if (tags?.items) {
				acc.count += tags?.items.length
			}
			return acc
		},
		{ count: 0, errors: [] } as { count: number; errors: ErrTypes[] }
	)
	if (count.errors.length > 0) {
		return err(count.errors[0])
	}
	return ok(count.count + non_vocabulary_tags.items.length)
}

export const tagsGetVocabularyPublicUseCase = async ({
	tags_service
}: {
	tags_service: TagsService
}) => {
	return await tags_service.getVocabularies()
}
