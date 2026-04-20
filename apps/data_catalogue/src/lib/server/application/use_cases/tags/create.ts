import type { TagsService } from '$lib/server/application/services/tags'
import { err, ok } from '$lib/server/entities/errors'
import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const tagCreateUseCase = async ({
	tag,
	vocabulary_id = 'general',
	tags_service,
	session
}: {
	vocabulary_id?: string
	tag: string
	tags_service: TagsService
	session: Session
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		namespace: 'Action',
		object: 'datasets',
		permits: 'read',
		actor: session.identity.id
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, result] = await tags_service
		.getVocabulary({ vocabulary_id })
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	let vocabulary = result
	if (errs !== null) {
		return err(errs)
	}
	if (!vocabulary) {
		const [errs] = await tags_service
			.createVocabulary({
				vocabulary: {
					name: vocabulary_id
				}
			})
			.then((res) => ok(res))
			.catch((_err) => err({ reason: 'Unexpected', error: _err }))
		if (errs !== null) {
			return err(errs)
		}
		const [errs_nv, res] = await tags_service
			.getVocabulary({ vocabulary_id })
			.then((res) => ok(res))
			.catch((_err) => err({ reason: 'Unexpected', error: _err }))

		if (errs_nv !== null) {
			return err(errs_nv)
		}
		if (res === null) {
			return err({ reason: 'Not Found' })
		}
		vocabulary = res
	}
	return await tags_service
		.createTag({
			tag: {
				name: tag,
				vocabulary_id: vocabulary.id
			}
		})
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
}
