import { env } from '$env/dynamic/private'
import { authenticationServiceInfrastructure } from '$lib/server/infrastructure/services/authentication'

export const getAuthenticationModule = () => {
	if (env.NODE_ENV === 'test') {
		return authenticationServiceInfrastructure.test
	}
	return authenticationServiceInfrastructure.kratos
}
