import type { IdentityService } from '$lib/server/application/services/identity'

export const infrastructureServiceIdentityTest: IdentityService = {
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
	},
	getIdentity: async () => ({
		email: '',
		first_name: '',
		last_name: ''
	})
}
