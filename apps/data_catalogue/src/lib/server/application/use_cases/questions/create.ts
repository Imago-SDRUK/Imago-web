import { err, ok } from '$lib/server/entities/errors'
import { questions } from '$lib/server/entities/models/questions'
import { type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'
import type { QuestionsRepository } from '$lib/server/application/repositories/questions'
import type { AppContext } from '$lib/server/application/context'

export const questionCreateUseCase = async ({
	data,
	session,
	questions_repository,
	authorisation_module,
	configuration
}: {
	data: unknown
	questions_repository: QuestionsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'questions',
		permits: 'create',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createInsertSchema(questions)
	const validated = schema(data)
	if (validated instanceof type.errors) {
		return err({ reason: 'Unauthorised', message: validated.summary })
	}

	const [errs, question] = await questions_repository.createQuestion({ data: validated })
	if (errs !== null) {
		return err(errs)
	}
	const [errs_p] = await authorisation_module.createPermissions({
		permissions: [
			{
				namespace: 'Question',
				object: question.id,
				relation: 'owners',
				actor: session.identity.id
			},
			{
				namespace: 'Question',
				object: question.id,
				relation: 'owners',
				actor: { namespace: 'Group', relation: 'members', object: 'admin' }
			}
		]
	})
	if (errs_p) {
		return err(errs_p)
	}
	return ok(question)
}
