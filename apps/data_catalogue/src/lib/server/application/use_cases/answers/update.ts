import type { Session } from '$lib/server/entities/models/identity'
import type { AnswersRepository } from '$lib/server/application/repositories/answers'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok } from '$lib/server/entities/errors'
import { answers } from '$lib/db/schema'
import { type } from 'arktype'
import { createUpdateSchema } from 'drizzle-arktype'

export const answerUpdateUseCase = async ({
	id,
	data,
	answers_repository,
	session
}: {
	id: string
	data: unknown
	session: Session
	answers_repository: AnswersRepository
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Answer',
		object: id,
		permits: 'edit'
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createUpdateSchema(answers)
	const validated = schema(data)
	if (validated instanceof type.errors) {
		return err({ reason: 'Unauthorised', message: validated.summary })
	}

	const [errs, answer] = await answers_repository.updateAnswer({ data: validated, id })
	if (errs !== null) {
		return err(errs)
	}
	return ok(answer)
}
