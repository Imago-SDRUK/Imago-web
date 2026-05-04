import type { ErrTypes } from '$lib/server/entities/errors'
import type {
	Tag,
	TagRequest,
	Vocabulary,
	VocabularyRequest
} from '$lib/server/entities/models/datasets'

export type TagsService = {
	createTag: ({ tag }: { tag: TagRequest }) => Promise<[ErrTypes, null] | [null, Tag]>
	createVocabulary: ({
		vocabulary
	}: {
		vocabulary: VocabularyRequest
	}) => Promise<[ErrTypes, null] | [null, Vocabulary]>
	getVocabulary: ({
		vocabulary_id
	}: {
		vocabulary_id: string
	}) => Promise<[ErrTypes, null] | [null, Vocabulary | null]>
	getVocabularies: () => Promise<[ErrTypes, null] | [null, Vocabulary[]]>
	getTags: ({
		search
	}: {
		limit: number
		offset: number
		search?: string
		vocabulary_id?: string
	}) => Promise<
		| [ErrTypes, null]
		| [null, { items: Tag[] | string[]; limit: number; next: number; total: number }]
	>
	getTag: ({
		id,
		vocabulary_id
	}: {
		id: string
		vocabulary_id: string
	}) => Promise<[ErrTypes, null] | [null, Tag | null]>
}
