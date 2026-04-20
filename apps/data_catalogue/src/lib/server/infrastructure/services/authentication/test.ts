import type { AuthenticationService } from '$lib/server/application/services/authentication'
export const infrastructureServiceAuthenticationTest: AuthenticationService = {
	validateSession: async () => {
		return {
			session: {
				active: true,
				identity: {
					first_name: '',
					email: '',
					id: '',
					last_name: ''
				},
				id: '',
				expires_at: '',
				verified: true
			}
		}
	}
}
