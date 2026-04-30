import type { QuestionsRepository } from '$lib/server/application/repositories/questions'
import { db } from '$lib/db'
import { questions } from '$lib/server/entities/models/questions'
import { err, ok } from '$lib/server/entities/errors'
import { asc, eq } from 'drizzle-orm'

const createQuestion: QuestionsRepository['createQuestion'] = async ({ data }) => {
	try {
		const question = await db.insert(questions).values(data).returning()
		return ok(question[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateQuestion: QuestionsRepository['updateQuestion'] = async ({ id, data }) => {
	try {
		const question = await db.update(questions).set(data).where(eq(questions.id, id)).returning()
		return ok(question[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateQuestionSort: QuestionsRepository['updateQuestionSort'] = async ({ id, sort }) => {
	try {
		const question = await db
			.update(questions)
			.set({ sort })
			.where(eq(questions.id, id))
			.returning()
		return ok(question[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getQuestion: QuestionsRepository['getQuestion'] = async ({ id }) => {
	try {
		const question = await db.select().from(questions).where(eq(questions.id, id))
		return ok(question[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getQuestions: QuestionsRepository['getQuestions'] = async ({ limit, offset }) => {
	try {
		const question = await db
			.select()
			.from(questions)
			.orderBy(asc(questions.sort))
			.limit(limit)
			.offset(offset)
		return ok(question)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deleteQuestion: QuestionsRepository['deleteQuestion'] = async ({ id }) => {
	try {
		await db.delete(questions).where(eq(questions.id, id))
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const questionsRepositoryInfrastructureDrizzle: QuestionsRepository = {
	createQuestion,
	deleteQuestion,
	getQuestion,
	updateQuestion,
	getQuestions,
	updateQuestionSort
}
