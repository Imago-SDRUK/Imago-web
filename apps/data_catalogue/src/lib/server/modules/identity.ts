import { env } from '$env/dynamic/private'
import { identityServiceInfrastructure } from '$lib/server/infrastructure/services/identity'

export const getIdentityModule = () => {
	if (env.NODE_ENV === 'test') {
		return identityServiceInfrastructure.test
	}
	return identityServiceInfrastructure.kratos
}
