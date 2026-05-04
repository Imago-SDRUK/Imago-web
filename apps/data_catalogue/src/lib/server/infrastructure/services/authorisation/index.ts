import type { AuthorisationService } from '$lib/server/application/services/autorisation'
import { authorisationServiceInfrastructureKeto } from '$lib/server/infrastructure/services/authorisation/keto'
import { authorisationServiceInfrastructureTest } from '$lib/server/infrastructure/services/authorisation/test'

export const authorisationServiceInfrastructure: {
	keto: AuthorisationService
	test: AuthorisationService
} = {
	keto: authorisationServiceInfrastructureKeto,
	test: authorisationServiceInfrastructureTest
}
