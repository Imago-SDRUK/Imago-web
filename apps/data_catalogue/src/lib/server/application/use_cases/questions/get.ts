import type { QuestionsRepository } from '$lib/server/application/repositories/questions'
import { err, ok } from '$lib/server/entities/errors'
import type { AppContext } from '$lib/server/application/context'

export const questionGetUseCase = async ({
	id,
	session,
	questions_repository,
	authorisation_module,
	configuration
}: {
	id: string
	questions_repository: QuestionsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Question',
		object: id,
		permits: 'read',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, question] = await questions_repository.getQuestion({ id })
	if (errs !== null) {
		return err(errs)
	}
	return ok(question)
}

export const questionsGetUseCase = async ({
	limit = 50,
	offset = 0,
	session,
	questions_repository,
	authorisation_module,
	configuration
}: {
	limit?: number
	offset?: number
	questions_repository: QuestionsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'questions',
		permits: 'read',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, question] = await questions_repository.getQuestions({ limit, offset })
	if (errs !== null) {
		return err(errs)
	}
	return ok(question)
}
