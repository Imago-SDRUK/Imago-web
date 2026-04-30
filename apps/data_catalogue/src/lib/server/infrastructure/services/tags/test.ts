import type { TagsService } from '$lib/server/application/services/tags'

export const infrastructureServiceTagsTest: TagsService = {
	getTags: async () => {
		return {
			total: 0,
			limit: 0,
			next: 0,
			items: []
		}
	},
	createVocabulary: async () => {
		return { name: '', tags: [] }
	},
	getVocabulary: async () => {
		return {
			name: '',
			tags: []
		}
	},
	createTag: async () => {
		return {
			name: '',
			vocabulary_id: '',
			display_name: '',
			state: 'active',
			id: ''
		}
	}
}
