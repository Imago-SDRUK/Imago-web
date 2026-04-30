import type { IdentityService } from '$lib/server/application/services/identity'
import { infrastructureServiceAuthenticationTest } from '$lib/server/infrastructure/services/authentication/test'
import { infrastructureServiceIdentityKratos } from '$lib/server/infrastructure/services/identity/kratos'

export const identityServiceInfrastructure: {
	kratos: IdentityService
	test: IdentityService
} = {
	kratos: infrastructureServiceIdentityKratos,
	test: infrastructureServiceAuthenticationTest
}
