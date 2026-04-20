import type { TagsService } from '$lib/server/application/services/tags'
import { infrastructureServiceTagsCkan } from '$lib/server/infrastructure/services/tags/ckan'
import { infrastructureServiceTagsTest } from '$lib/server/infrastructure/services/tags/test'

export const tagsServiceInfrastructure: {
	ckan: TagsService
	test: TagsService
} = {
	ckan: infrastructureServiceTagsCkan,
	test: infrastructureServiceTagsTest
}
