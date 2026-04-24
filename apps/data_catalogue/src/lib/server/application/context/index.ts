import type { AuthorisationService } from '$lib/server/application/services/autorisation'
import type { Configuration } from '$lib/server/entities/models/configuration'
import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export type AppContext = {
	session: Session
	configuration: Configuration
	authorisation_module: AuthorisationService
	identity_token?: string
}

export const getServerContext = ({
	session,
	configuration,
	identity_token
}: {
	session: Session
	configuration: Configuration
	identity_token?: string
}): AppContext => {
	return {
		session,
		configuration,
		authorisation_module: getAuthorisationModule(),
		identity_token
	}
}
