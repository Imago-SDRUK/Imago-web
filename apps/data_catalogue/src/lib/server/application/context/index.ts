import type { AuthorisationService } from '$lib/server/application/services/autorisation'
import type { Configuration } from '$lib/server/entities/models/configuration'
import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

type Context = {
	session: Session
	configuration: Configuration
	authorisation_module: AuthorisationService
}

export const getServerContext = ({
	session,
	configuration
}: {
	session: Session
	configuration: Configuration
}): Context => {
	return {
		session,
		configuration,
		authorisation_module: getAuthorisationModule()
	}
}
