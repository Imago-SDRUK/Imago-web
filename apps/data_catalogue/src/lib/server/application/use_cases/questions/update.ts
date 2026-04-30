import type { QuestionsRepository } from '$lib/server/application/repositories/questions'
import { err, ok } from '$lib/server/entities/errors'
import { questions, type QuestionRequest } from '$lib/server/entities/models/questions'
import { type } from 'arktype'
import { createUpdateSchema } from 'drizzle-arktype'
import type { AppContext } from '$lib/server/application/context'
import { log } from '$lib/utils/server/logger'

export const questionUpdateUseCase = async ({
	id,
	data,
	session,
	questions_repository,
	authorisation_module,
	configuration
}: {
	id: string
	data: Partial<QuestionRequest>
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

	const validated = schema({
		question: data.question,
		description: data.description,
		label: data.label,
		required: data.required,
		group: data.group,
		type: data.type,
		options: data.options,
		conditionals: data.conditionals,
		visibility: data.visibility,
		status: data.status,
		sort: data.sort
	})
	if (validated instanceof type.errors) {
		console.log(data)
		return err({ reason: 'Unauthorised', message: validated.summary })
	}
	log.trace({ message: 'Updating', question: validated })
	const [errs, answer] = await questions_repository.updateQuestion({ data: validated, id })
	if (errs !== null) {
		return err(errs)
	}
	return ok(answer)
}

export const questionUpdateSortUseCase = async ({
	id,
	sort,
	session,
	questions_repository,
	authorisation_module,
	configuration
}: {
	id: string
	sort: string
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
	if (!sort) {
		return err({ reason: 'Invalid Data', message: 'You need to provide a sort value', id: '' })
	}
	if (typeof sort !== 'string') {
		return err({ reason: 'Invalid Data', message: 'Sort needs to be a string', id: '' })
	}
	log.trace({ message: 'Updating', question: id, sort })
	const [errs, answer] = await questions_repository.updateQuestionSort({ sort, id })
	if (errs !== null) {
		return err(errs)
	}
	return ok(answer)
}
