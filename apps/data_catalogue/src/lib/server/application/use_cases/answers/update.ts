import type { AnswersRepository } from '$lib/server/application/repositories/answers'
import { err, ok } from '$lib/server/entities/errors'
import { answers } from '$lib/db/schema'
import { type } from 'arktype'
import { createUpdateSchema } from 'drizzle-arktype'
import type { AppContext } from '$lib/server/application/context'

export const answerUpdateUseCase = async ({
	id,
	data,
	answers_repository,
	session,
	configuration,
	authorisation_module
}: {
	id: string
	data: unknown
	answers_repository: AnswersRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Answer',
		object: id,
		permits: 'edit',
		configuration
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
