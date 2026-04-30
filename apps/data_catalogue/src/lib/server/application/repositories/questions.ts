import type { ErrTypes } from '$lib/server/entities/errors'
import type { Question, QuestionRequest } from '$lib/server/entities/models/questions'

export type QuestionsRepository = {
	getQuestion: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, Question]>
	getQuestions: ({
		limit,
		offset
	}: {
		limit: number
		offset: number
	}) => Promise<[ErrTypes, null] | [null, Question[]]>
	createQuestion: ({
		data
	}: {
		data: QuestionRequest
	}) => Promise<[ErrTypes, null] | [null, Question]>
	updateQuestion: ({
		id
	}: {
		id: string
		data: Partial<QuestionRequest>
	}) => Promise<[ErrTypes, null] | [null, Question]>
	updateQuestionSort: ({
		id
	}: {
		id: string
		sort: string
	}) => Promise<[ErrTypes, null] | [null, Question]>
	deleteQuestion: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, null]>
}
