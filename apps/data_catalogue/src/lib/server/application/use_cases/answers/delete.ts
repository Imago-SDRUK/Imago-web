import type { AnswersRepository } from '$lib/server/application/repositories/answers'
import { err, ok } from '$lib/server/entities/errors'
import type { AppContext } from '$lib/server/application/context'

export const answerDeleteUseCase = async ({
	id,
	answers_repository,
	session,
	authorisation_module,
	configuration
}: {
	id: string
	answers_repository: AnswersRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Answer',
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
	const [errs, answer] = await answers_repository.deleteAnswer({ id })
	if (errs !== null) {
		return err(errs)
	}
	return ok(answer)
}
