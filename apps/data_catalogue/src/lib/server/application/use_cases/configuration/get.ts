import type { ConfigurationRepository } from '$lib/server/application/repositories/configuration'
import { err, ok } from '$lib/server/entities/errors'

export const configurationGetUseCase = async ({
	configuration_repository
}: {
	configuration_repository: ConfigurationRepository
}) =>
	await configuration_repository.getConfiguration({ id: 'config' }).then(([errors, config]) => {
		if (errors !== null) {
			return err(errors)
		}
		return ok(config)
	})
