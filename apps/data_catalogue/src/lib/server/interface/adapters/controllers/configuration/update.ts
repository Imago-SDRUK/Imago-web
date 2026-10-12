import type { Configuration } from '$lib/server/entities/models/configuration'
import { err, ok } from '$lib/server/entities/errors'
import { getServerContext } from '$lib/server/application/context'
import {
	configurationAddSuperUserUseCase,
	configurationRemoveSuperUserUseCase,
	configurationSetStorageUseCase
} from '$lib/server/application/use_cases/configuration/update'
import { getConfigurationModule } from '$lib/server/modules/configuration'

export const configurationAddSuperUserController = async ({
	id,
	session,
	configuration
}: {
	id: string
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an id', id: '' })
	}
	const [errors, answer] = await configurationAddSuperUserUseCase({
		id,
		configuration_repository: getConfigurationModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}

export const configurationRemoveSuperUserController = async ({
	id,
	session,
	configuration
}: {
	id: string
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an id', id: '' })
	}
	const [errors, answer] = await configurationRemoveSuperUserUseCase({
		id,
		configuration_repository: getConfigurationModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}

export const configurationSetStorageController = async ({
	data,
	session,
	configuration
}: {
	data: { kind: string; id: string }
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, answer] = await configurationSetStorageUseCase({
		data,
		configuration_repository: getConfigurationModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
