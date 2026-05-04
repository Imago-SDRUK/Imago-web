import { env } from '$env/dynamic/private'
import { resourceServiceInfrastructure } from '$lib/server/infrastructure/services/resources'

export const getResourceServiceModule = () => {
	if (env.NODE_ENV === 'test') {
		return resourceServiceInfrastructure['test']
	}
	return resourceServiceInfrastructure['ckan']
}
