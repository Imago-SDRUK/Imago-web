import type { QuestionsRepository } from '$lib/server/application/repositories/questions'
import { err, ok } from '$lib/server/entities/errors'
import { questions } from '$lib/server/entities/models/questions'
import { type } from 'arktype'
import { createUpdateSchema } from 'drizzle-arktype'
import type { AppContext } from '$lib/server/application/context'

export const questionUpdateUseCase = async ({
	id,
	data,
	session,
	questions_repository,
	authorisation_module,
	configuration
}: {
	id: string
	data: unknown
	questions_repository: QuestionsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Question',
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
	const schema = createUpdateSchema(questions)
	const validated = schema(data)
	if (validated instanceof type.errors) {
		return err({ reason: 'Unauthorised', message: validated.summary })
	}

	const [errs, answer] = await questions_repository.updateQuestion({ data: validated, id })
	if (errs !== null) {
		return err(errs)
	}
	return ok(answer)
}
