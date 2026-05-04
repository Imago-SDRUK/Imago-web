import { env } from '$env/dynamic/private'
import { groupRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/groups'
import { groupsServiceInfrastructure } from '$lib/server/infrastructure/services/groups'

export const getGroupsRepositoryModule = () => {
	if (env.NODE_ENV === 'test') {
		return groupRepositoryInfrastructure['test']
	}
	return groupRepositoryInfrastructure['drizzle']
}

export const getGroupsServiceModule = () => {
	if (env.NODE_ENV === 'test') {
		return groupsServiceInfrastructure['test']
	}
	return groupsServiceInfrastructure['ckan']
}
