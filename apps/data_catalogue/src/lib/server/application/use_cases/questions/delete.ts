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
	const auth_service = getAuthorisationModule()
	const [errors, permission] = await auth_service.authorise({
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
	const [errs_p] = await auth_service.deletePermission({ namespace: 'Question', object: id })
	if (errs_p !== null) {
		return err(errs_p)
	}
	return ok(question)
}
