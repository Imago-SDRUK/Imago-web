import { env } from '$env/dynamic/private'
import { userServiceInfrastructure } from '$lib/server/infrastructure/services/users'

export const getUserServiceModule = () => {
	if (env.NODE_ENV === 'test') {
		return userServiceInfrastructure['test']
	}
	return userServiceInfrastructure['ckan']
}
