import type { Session } from '$lib/server/entities/models/identity'
import type { AnswersRepository } from '$lib/server/application/repositories/answers'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok } from '$lib/server/entities/errors'

export const answerDeleteUseCase = async ({
	id,
	answers_repository,
	session
}: {
	session: Session
	id: string
	answers_repository: AnswersRepository
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Answer',
		object: id,
		permits: 'delete'
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
