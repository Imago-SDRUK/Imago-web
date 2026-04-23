import type { AnswersRepository } from '$lib/server/application/repositories/answers'
import { err, ok } from '$lib/server/entities/errors'
import type { AppContext } from '$lib/server/application/context'

export const answerGetUseCase = async ({
	id,
	answers_repository,
	session,
	configuration,
	authorisation_module
}: {
	id: string
	answers_repository: AnswersRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Answer',
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
	const [errs, answer] = await answers_repository.getAnswer({ id })
	if (errs !== null) {
		return err(errs)
	}
	return ok(answer)
}
