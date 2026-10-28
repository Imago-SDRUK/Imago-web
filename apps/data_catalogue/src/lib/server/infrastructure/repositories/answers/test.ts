import type { IAnswersRepository } from '$lib/server/application/repositories/answers'
import type { Answer } from '$lib/server/entities/models/questions'
import { err, ok } from '$lib/server/entities/errors'
import { DateTime } from 'luxon'
import { getId } from '@arturoguzman/art-ui'

let mock: Answer[] = []

const createAnswer: IAnswersRepository['createAnswer'] = async ({ data }) => {
	const answer: Answer = {
		...data,
		id: getId(),
		number: data.number ?? null,
		free_text: data.free_text ?? null,
		bool: data.bool ?? false,
		time: data.time ?? null,
		answer: data.answer ?? null,
		question_reference: data.question_reference ?? null,
		status: 'published',
		created_at: DateTime.now().toJSDate(),
		updated_at: DateTime.now().toJSDate(),
		deleted_at: null,
		created_by: data.created_by ?? null,
		updated_by: data.updated_by ?? null
	}
	mock.push(answer)
	return ok(answer)
}

const createAnswers: IAnswersRepository['createAnswers'] = async ({ data }) => {
	const answers: Answer[] = data.map((data) => ({
		...data,
		id: getId(),
		number: data.number ?? null,
		free_text: data.free_text ?? null,
		bool: data.bool ?? false,
		time: data.time ?? null,
		answer: data.answer ?? null,
		question_reference: data.question_reference ?? null,
		status: 'published',
		created_at: DateTime.now().toJSDate(),
		updated_at: DateTime.now().toJSDate(),
		deleted_at: null,
		created_by: data.created_by ?? null,
		updated_by: data.updated_by ?? null
	}))
	mock = [...mock, ...answers]
	return ok(answers)
}

const updateAnswer: IAnswersRepository['updateAnswer'] = async ({ id, data }) => {
	const index = mock.findIndex((x) => x.id === id)
	if (index > -1) {
		const result = {
			id: mock[index].id,
			number: data.number ?? mock[index].number,
			free_text: data.free_text ?? mock[index].free_text,
			bool: data.bool ?? mock[index].bool,
			time: data.time ?? mock[index].time,
			answer: data.answer ?? mock[index].answer,
			question_reference: data.question_reference ?? mock[index].question_reference,
			status: data.status ?? mock[index].status,
			created_at: mock[index].created_at,
			updated_at: DateTime.now().toJSDate(),
			deleted_at: null,
			created_by: data.created_by ?? mock[index].created_by,
			updated_by: data.updated_by ?? mock[index].updated_by,
			question: data.question ?? mock[index].question
		}
		mock[index] = result
		return ok(result)
	}
	return err({ reason: 'Not Found', message: `Answer not found` })
}
const getAnswer: IAnswersRepository['getAnswer'] = async ({ id }) => {
	const answer = mock.find((x) => x.id === id)
	if (answer) {
		return ok(answer)
	}
	return err({ reason: 'Not Found', message: `Answer not found` })
}

const deleteAnswer: IAnswersRepository['deleteAnswer'] = async ({ id }) => {
	const index = mock.findIndex((x) => x.id === id)
	if (index > -1) {
		mock = [...mock.slice(0, index), ...mock.slice(index + 1)]
	}
	return ok(null)
}

const getTotalNewsletterSignUps = async () => {
    return ok(0)
}

const getNewsletterSignUpsByCountry = async () => {
    return ok([])
}

const getNewsletterSignUpsByCategory = async () => {
    return ok([])
}

const getNewsletterSignUpsWithDownloads = async () => {
    return ok(0)
}

const getTopDownloadedResourcesByCategory = async () => {
    return ok([])
}

export const answersRepositoryInfrastructureTest: IAnswersRepository = {
	createAnswer,
	deleteAnswer,
	getAnswer,
	updateAnswer,
	createAnswers,
	getTotalNewsletterSignUps,
	getNewsletterSignUpsByCountry,
	getNewsletterSignUpsByCategory,
	getNewsletterSignUpsWithDownloads,
	getTopDownloadedResourcesByCategory
}
