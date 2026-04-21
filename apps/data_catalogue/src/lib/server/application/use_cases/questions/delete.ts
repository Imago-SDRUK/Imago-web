import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok } from '$lib/server/entities/errors'
import type { QuestionsRepository } from '$lib/server/application/repositories/questions'

export const questionDeleteUseCase = async ({
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
		permits: 'delete'
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, question] = await questions_repository.deleteQuestion({ id })
	if (errs !== null) {
		return err(errs)
	}
	return ok(question)
}
