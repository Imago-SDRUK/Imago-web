import type { Session } from '$lib/server/entities/models/identity'
import type { QuestionsRepository } from '$lib/server/application/repositories/questions'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok } from '$lib/server/entities/errors'

export const questionGetUseCase = async ({
	id,
	session,
	questions_repository
}: {
	session: Session
	id: string
	questions_repository: QuestionsRepository
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Question',
		object: id,
		permits: 'read'
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
	questions_repository
}: {
	limit?: number
	offset?: number
	session: Session
	questions_repository: QuestionsRepository
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'questions',
		permits: 'read'
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
