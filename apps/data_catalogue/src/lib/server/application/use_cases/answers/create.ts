import type { AnswerRequest } from '$lib/server/entities/models/questions'
import type { AnswersRepository } from '$lib/server/application/repositories/answers'
import type { PermissionRequest } from '$lib/server/entities/models/permissions'
import type { AuthorisationService } from '$lib/server/application/services/autorisation'
import type { AppContext } from '$lib/server/application/context'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import { answers } from '$lib/db/schema'
import { type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'
import { getAnswerBasePermissions } from '$lib/server/entities/models/policies'
import type { QuestionsRepository } from '$lib/server/application/repositories/questions'

export const answerCreateUseCase = async ({
	data,
	answers_repository,
	session,
	authorisation_module,
	configuration,
	question_repository,
	tx
}: {
	data: { question_id: string; answer: string }
	answers_repository: AnswersRepository
	authorisation_module: AuthorisationService
	question_repository: QuestionsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'answers',
		permits: 'create',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [question_error, question] = await question_repository.getQuestion({ id: data.question_id })
	if (question_error !== null) {
		return err(question_error)
	}

	const schema = createInsertSchema(
		answers,
		question.required
			? {
					answer: () => type('string>1')
				}
			: undefined
	)
	const validated = schema(data)
	if (validated instanceof type.errors) {
		return err({ reason: 'Unauthorised', message: validated.summary })
	}

	const [errs, answer] = await answers_repository.createAnswer({ data: validated, tx })
	if (errs !== null) {
		return err(errs)
	}
	return ok(answer)
}

export const answersCreateUseCase = async ({
	data,
	answers_repository,
	session,
	configuration,
	authorisation_module,
	question_repository
}: {
	data: { question_id: string; answer: string }[]
	answers_repository: AnswersRepository
	question_repository: QuestionsRepository
} & AppContext) => {
	const [errs, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'answers',
		permits: 'create',
		configuration
	})
	if (errs) {
		return err(errs)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [question_error, questions] = await question_repository.getQuestions({
		limit: 250,
		offset: 0
	})
	if (question_error !== null) {
		return err(question_error)
	}

	const schemaAnswerRequired = createInsertSchema(answers, {
		answer: () => type('string>1')
	})
	const schemaAnswerOptional = createInsertSchema(answers)

	const { errors, validated } = questions.reduce(
		(acc, question) => {
			const answer = data.find((answer) => answer.question_id === question.id)
			let required = question.required
			if (question.conditionals && question.conditionals.length > 0) {
				question.conditionals.forEach((conditional) => {
					const required_value = data.find(
						(answer) => answer.question_id === conditional.question
					)?.answer
					if (required_value) {
						if (conditional.operator === 'equal') {
							if (required_value === conditional.value) {
								required = conditional.action.includes('required')
							}
						}
					}
				})
			}
			if (required) {
				if (!answer) {
					acc.errors.push({
						reason: 'Invalid Data',
						message: `You need to provide an answer for ${question.question}`,
						id: 'missing-answer'
					})
					return acc
				}
				const valid = schemaAnswerRequired({
					answer: answer.answer,
					question: question.id,
					created_by: session.identity.id,
					updated_by: session.identity.id,
					question_reference: question.question
				})
				if (valid instanceof type.errors) {
					acc.errors.push({
						reason: 'Invalid Data',
						message: `${question.question} ${valid.summary}`,
						id: 'invalid-data'
					})
					return acc
				}
				acc.validated.push(valid)
			}
			if (!question.required && answer) {
				const valid = schemaAnswerOptional({
					answer: answer.answer,
					question: question?.id,
					created_by: session.identity.id,
					updated_by: session.identity.id,
					question_reference: question?.question
				})
				if (valid instanceof type.errors) {
					acc.errors.push({
						reason: 'Invalid Data',
						message: `${question.question} ${valid.summary}`,
						id: question.id
					})
					return acc
				}
				acc.validated.push(valid)
				return acc
			}
			return acc
		},
		{ errors: [], validated: [] } as {
			errors: ErrTypes[]
			validated: AnswerRequest[]
		}
	)
	if (errors.length > 0) {
		return err(errors[0])
	}

	const [user_answers_errors, user_answers] = await answers_repository.createAnswers({
		data: validated
	})
	if (user_answers_errors !== null) {
		return err(user_answers_errors)
	}
	const permissions: PermissionRequest[] = user_answers.flatMap((answer) =>
		getAnswerBasePermissions({
			user_id: session.identity.id,
			answer,
			admin_group: configuration.admin_group
		})
	)
	const [p_errs] = await authorisation_module.createPermissions({ permissions })
	if (p_errs !== null) {
		return err(p_errs)
	}

	return ok(user_answers)
}
