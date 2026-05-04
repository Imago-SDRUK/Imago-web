import { getConfigurationModule } from '$lib/server/modules/configuration'
import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { getIdentityModule } from '$lib/server/modules/identity'
import { getUserModule } from '$lib/server/modules/user'
import { configurationInitialiseUseCase } from '$lib/server/application/use_cases/configuration/create'
import { err, ok } from '$lib/server/entities/errors'

export const configurationInitialiseController = async ({
	data
}: {
	data: {
		identity: { first_name: string; last_name: string; email: string; password: string }
	}
}) => {
	const [errors, res] = await configurationInitialiseUseCase({
		data,
		config_repository: getConfigurationModule(),
		identity_service: getIdentityModule(),
		groups_repository: getGroupsRepositoryModule(),
		users_repository: getUserModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(res)
}
