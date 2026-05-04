import type { AuthenticationService } from '$lib/server/application/services/authentication'
import { infrastructureServiceAuthenticationKratos } from '$lib/server/infrastructure/services/authentication/kratos'
import { infrastructureServiceAuthenticationTest } from '$lib/server/infrastructure/services/authentication/test'

export const authenticationServiceInfrastructure: {
	kratos: AuthenticationService
	test: AuthenticationService
} = {
	kratos: infrastructureServiceAuthenticationKratos,
	test: infrastructureServiceAuthenticationTest
}
