import type { Session } from '$lib/server/entities/models/identity'
import type { QuestionsRepository } from '$lib/server/application/repositories/questions'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok } from '$lib/server/entities/errors'
import { questions } from '$lib/server/entities/models/questions'
import { type } from 'arktype'
import { createUpdateSchema } from 'drizzle-arktype'

export const questionUpdateUseCase = async ({
	id,
	data,
	session,
	questions_repository
}: {
	id: string
	data: unknown
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
