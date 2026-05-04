import { env } from '$env/dynamic/private'
import { authorisationServiceInfrastructure } from '$lib/server/infrastructure/services/authorisation'

export const getAuthorisationModule = () => {
	if (env.NODE_ENV === 'test') {
		return authorisationServiceInfrastructure.test
	}
	return authorisationServiceInfrastructure.keto
}
