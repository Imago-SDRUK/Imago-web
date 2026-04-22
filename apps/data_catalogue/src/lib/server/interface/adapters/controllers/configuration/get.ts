import { configurationGetUseCase } from '$lib/server/application/use_cases/configuration/get'
import { err, ok } from '$lib/server/entities/errors'
import { getConfigurationModule } from '$lib/server/modules/configuration'

export const configurationGetController = async () => {
	const [errors, res] = await configurationGetUseCase({
		configuration_repository: getConfigurationModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(res)
}
