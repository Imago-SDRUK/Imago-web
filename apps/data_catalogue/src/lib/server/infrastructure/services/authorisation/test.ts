import type { AuthorisationService } from '$lib/server/application/services/autorisation'

export const authorisationServiceInfrastructureTest: AuthorisationService = {
	authorise: async () => {
		return { allowed: true }
	},
	createPermission: async () => {},
	deletePermission: async () => {}
}
