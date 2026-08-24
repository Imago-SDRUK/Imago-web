import { handleArkErrors } from '$lib/db/validation'
import type { AppContext } from '$lib/server/application/context'
import type { ITagsService } from '$lib/server/application/services/tags'
import { err, ok } from '$lib/server/entities/errors'
import { VocabularySchema, type VocabularyRequest } from '$lib/server/entities/models/datasets'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { type } from 'arktype'

export const tagCreateUseCase = async ({
	tag,
	vocabulary_name = 'general',
	tags_service,
	session,
	configuration
}: {
	vocabulary_name?: string
	tag: string
	tags_service: ITagsService
} & AppContext) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		namespace: 'Application',
		object: 'datasets',
		permits: 'manage',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [vocabulary_errors, vocabularies] = await tags_service.getVocabularies()
	if (vocabulary_errors !== null) {
		return err(vocabulary_errors)
	}

	let vocabulary = vocabularies?.find((v) => v.name === vocabulary_name)

	if (!vocabulary) {
		const [errs, voc] = await tags_service.createVocabulary({
			vocabulary: {
				name: vocabulary_name
			}
		})
		if (errs !== null) {
			return err(errs)
		}
		if (voc === null) {
			return err({ reason: 'Unexpected', error: voc })
		}
		const [errs_nv, res] = await tags_service.getVocabulary({ vocabulary_id: voc.id })

		if (errs_nv !== null) {
			return err(errs_nv)
		}
		if (res === null) {
			return err({ reason: 'Not Found', message: `Voc err` })
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

export const vocabularyCreateUseCase = async ({
	vocabulary_request,
	configuration,
	authorisation_module,
	tags_service,
	session
}: {
	vocabulary_request: VocabularyRequest
	tags_service: ITagsService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Application',
		object: 'datasets',
		permits: 'manage',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const validated = VocabularySchema(vocabulary_request)
	if (validated instanceof type.errors) {
		return err({
			reason: 'Invalid Data',
			message: validated.summary,
			errors: handleArkErrors(validated),
			id: 'invalid-data-vocabulary'
		})
	}
	const [vocabulary_errors, vocabulary] = await tags_service.createVocabulary({
		vocabulary: vocabulary_request
	})
	if (vocabulary_errors !== null) {
		return err(vocabulary_errors)
	}
	return ok(vocabulary)
}
