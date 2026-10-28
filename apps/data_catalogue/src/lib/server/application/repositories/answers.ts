import type { Transaction } from '$lib/db'
import type { ErrTypes } from '$lib/server/entities/errors'
import type { Answer, AnswerRequest } from '$lib/server/entities/models/questions'

export type IAnswersRepository = {
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


getTotalNewsletterSignUps: () => Promise<
    [ErrTypes, null] | [null, number]
>

getNewsletterSignUpsByCountry: () => Promise<
    [ErrTypes, null] | [null, { country: string; total: number }[]]
>

getNewsletterSignUpsByCategory: () => Promise<
    [ErrTypes, null] | [null, { category: string; total: number }[]]
>

getNewsletterSignUpsWithDownloads: () => Promise<
    [ErrTypes, null] | [null, number]
>

getTopDownloadedResourcesByCategory: () => Promise<
    [ErrTypes, null] | [
        null,
        {
            category: string
            resource_id: string
            resource_title: string
            download_count: number
        }[]
    ]
>

}