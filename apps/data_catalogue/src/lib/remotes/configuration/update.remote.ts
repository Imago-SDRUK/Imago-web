import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import {
	configurationAddSuperUserController,
	configurationRemoveSuperUserController,
	configurationSetStorageController
} from '$lib/server/interface/adapters/controllers/configuration/update'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const configurationAddSuperUser = form(type({ id: 'string' }), async ({ id }) => {
	const { locals } = getRequestEvent()
	const [errors, data] = await configurationAddSuperUserController({
		id,
		configuration: locals.configuration,
		session: locals.session
	})
	if (errors !== null) {
		error(...errFmt(errors))
	}
	return data
})

export const configurationRemoveSuperUser = form(type({ id: 'string' }), async ({ id }) => {
	const { locals } = getRequestEvent()
	const [errors, data] = await configurationRemoveSuperUserController({
		id,
		configuration: locals.configuration,
		session: locals.session
	})
	if (errors !== null) {
		error(...errFmt(errors))
	}
	return data
})

export const configurationSetStorage = form(
	type({ kind: 'string', id: 'string' }),
	async ({ kind, id }) => {
		const { locals } = getRequestEvent()
		const [errors, data] = await configurationSetStorageController({
			data: { kind, id },
			configuration: locals.configuration,
			session: locals.session
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return data
	}
)
