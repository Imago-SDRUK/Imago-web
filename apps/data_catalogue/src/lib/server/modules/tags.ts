import { env } from '$env/dynamic/private'
import { tagsServiceInfrastructure } from '$lib/server/infrastructure/services/tags'

export const getTagsModule = () => {
	if (env.NODE_ENV === 'test') {
		return tagsServiceInfrastructure['test']
	}
	return tagsServiceInfrastructure['ckan']
}
