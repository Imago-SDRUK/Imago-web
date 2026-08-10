import type { AppContext } from '$lib/server/application/context'
import type { IConfigurationRepository } from '$lib/server/application/repositories/configuration'
import { err } from '$lib/server/entities/errors'

export const configurationAddSuperUserUseCase = async ({
	id,
	configuration,
	configuration_repository,
	session
}: { id: string; configuration_repository: IConfigurationRepository } & AppContext) => {
	if (!configuration.superusers) {
		return err({
			reason: 'Invalid Data',
			message: 'Only superusers can add other superusers',
			id: ''
		})
	}
	if (!configuration.superusers.includes(session.identity.id)) {
		return err({
			reason: 'Invalid Data',
			message: 'Only superusers can add other superusers',
			id: ''
		})
	}
	const res = await configuration_repository.addSuperUser({ id, config_id: configuration.id })
	return res
}

export const configurationRemoveSuperUserUseCase = async ({
	id,
	configuration,
	configuration_repository,
	session
}: { id: string; configuration_repository: IConfigurationRepository } & AppContext) => {
	if (!configuration.superusers) {
		return err({
			reason: 'Invalid Data',
			message: 'Only superusers can add other superusers',
			id: ''
		})
	}
	if (!configuration.superusers.includes(session.identity.id)) {
		return err({
			reason: 'Invalid Data',
			message: 'Only superusers can add other superusers',
			id: ''
		})
	}
	if (configuration.superusers.length === 1) {
		return err({
			reason: 'Invalid Data',
			message: `You need at least 1 superuser`,
			id: ''
		})
	}
	if (session.identity.id === id) {
		return err({
			reason: 'Invalid Data',
			message: `You can't remove yourself as superuser`,
			id: ''
		})
	}

	const res = await configuration_repository.removeSuperUser({ id, config_id: configuration.id })
	return res
}
