import type { Transaction } from '$lib/db'
import type { ErrTypes } from '$lib/server/entities/errors'
import type { Answer, AnswerRequest } from '$lib/server/entities/models/questions'

export type AnswersRepository = {
	getAnswer: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, Answer]>
	createAnswer: ({
		data
	}: {
		data: AnswerRequest
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, Answer]>
	createAnswers: ({
		data
	}: {
		data: AnswerRequest[]
	}) => Promise<[ErrTypes, null] | [null, Answer[]]>
	updateAnswer: ({
		id
	}: {
		id: string
		data: Partial<AnswerRequest>
	}) => Promise<[ErrTypes, null] | [null, Answer]>
	deleteAnswer: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, null]>
}
