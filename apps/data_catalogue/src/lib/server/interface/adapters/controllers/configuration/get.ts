import { configurationGetUseCase } from '$lib/server/application/use_cases/configuration/get'
import { err, ok } from '$lib/server/entities/errors'
import { getConfigurationModule } from '$lib/server/modules/configuration'
import { log } from '$lib/utils/server/logger'

export const configurationGetController = async () => {
	log.trace({ controller: 'configurationGetController' })
	const [errors, res] = await configurationGetUseCase({
		configuration_repository: getConfigurationModule()
	})
	if (errors !== null) {
		log.error({ controller: 'configurationGetController', error: errors })
		return err(errors)
	}
	return ok(res)
}
