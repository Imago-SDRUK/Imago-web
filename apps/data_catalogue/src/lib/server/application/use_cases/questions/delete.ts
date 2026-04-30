import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok } from '$lib/server/entities/errors'
import type { QuestionsRepository } from '$lib/server/application/repositories/questions'
import type { AppContext } from '$lib/server/application/context'

export const questionDeleteUseCase = async ({
	id,
	session,
	questions_repository,
	authorisation_module,
	configuration
}: {
	id: string
	questions_repository: QuestionsRepository
} & AppContext) => {
	const auth_service = getAuthorisationModule()
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Question',
		object: id,
		permits: 'delete',
		configuration
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
