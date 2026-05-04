import { db } from '$lib/db'
import { answers, questions } from '$lib/db/schema'
import type { Answer } from '$lib/server/entities/models/questions'
import { handleArkErrors, type ArkFormErrors } from '$lib/db/validation'
import { handleDBError } from '$lib/utils/db'
import { COUNTRIES } from '$lib/utils/forms/countries'
import { type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'
import { eq } from 'drizzle-orm'

export type Question = typeof questions.$inferSelect
//
// export const answers = pgTable('answers', {
// 	answer: text(),
// })

export const validateInsertAnswer = (record: Record<PropertyKey, unknown>) => {
	const _schema = createInsertSchema(answers)
	const refine = type(_schema).and({ answer: 'string >= 2' })
	const parsed = refine(record)
	if (parsed instanceof type.errors) {
		return handleArkErrors(parsed)
	}
	return {
		success: true as const,
		data: parsed
	}
	// const parsed = _schema(record)
	// if (parsed instanceof type.errors) {
	// 	return handleArkErrors(parsed)
	// }
	// return {
	// 	success: true,
	// 	data: parsed
	// }
}

const checkAnswer =
	({ answer, user_id }: { answer: string; user_id: string }) =>
	(
		question: Question
	): {
		answer: ArkFormErrors | { success: true; data: Answer }
		question: string
		type?: string | null
	} => {
		if (question.type === 'string') {
			return {
				question: question.id,
				type: question.type,
				answer: validateInsertAnswer({
					question: question.id,
					question_reference: question.question,
					answer: answer,
					created_by: user_id,
					updated_by: user_id
				})
			}
		}
		if (question.type === 'select') {
			if (question.options?.map((opt) => opt.value).includes(answer)) {
				return {
					question: question.id,
					type: question.type,
					answer: validateInsertAnswer({
						question: question.id,
						question_reference: question.question,
						answer: answer,
						created_by: user_id,
						updated_by: user_id
					})
				}
			}
		}
		if (question.type === 'bool') {
			if (answer === 'on') {
				return {
					question: question.id,
					type: question.type,
					answer: validateInsertAnswer({
						question: question.id,
						question_reference: question.question,
						answer: answer,
						created_by: user_id,
						updated_by: user_id
					})
				}
			}
		}
		if (question.type === 'countries') {
			if (COUNTRIES.map((country) => country.value).includes(answer)) {
				return {
					question: question.id,
					type: question.type,
					answer: validateInsertAnswer({
						question: question.id,
						question_reference: question.question,
						answer: answer,
						created_by: user_id,
						updated_by: user_id
					})
				}
			}
		}
		return {
			question: question.id,
			type: question.type,
			answer: {
				success: false,
				errors: { answer: `${answer} is not a valid answer to question ${question.question}` }
			}
		}
	}

export const validateAnswersForm = ({
	answers,
	user_id
}: {
	answers: Record<string, string>
	user_id: string
}) =>
	Object.entries(answers).flatMap(([question_id, answer]) => {
		return db
			.select()
			.from(questions)
			.where(eq(questions.id, question_id))
			.then((questions) => checkAnswer({ answer, user_id })(questions[0]))
			.catch(handleDBError(`Question ${question_id} not found`))
	})

export const validateAnswer = ({
	answer,
	user_id
}: {
	answer: { question: string; answer: string }
	user_id: string
}) =>
	db
		.select()
		.from(questions)
		.where(eq(questions.id, answer.question))
		.then((question) =>
			validateInsertAnswer({
				question: question[0].id,
				question_reference: question[0].question,
				answer: answer.answer,
				created_by: user_id,
				updated_by: user_id,
				status: 'published'
			})
		)
		.catch(handleDBError(`Question ${answer.question} not found`))
