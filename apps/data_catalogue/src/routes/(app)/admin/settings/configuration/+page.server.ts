import { errFmt, type ErrTypes } from '$lib/server/entities/errors'
import type { User, UserServiceApiToken } from '$lib/server/entities/models/users'
import {
	userGetController,
	userServiceGetUserApiKeysController,
	userServiceGetUsersController
} from '$lib/server/interface/adapters/controllers/users/get'
import { error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	const { errors, data } = await Promise.all(
		locals.configuration.superusers?.map((id) =>
			userGetController({ configuration: locals.configuration, session: locals.session, id })
		) ?? []
	).then((res) =>
		res.reduce(
			(
				acc: {
					errors: ErrTypes[]
					data: (User & { first_name: string; last_name: string; email: string; id: string })[]
				},
				[errors, data]
			) => {
				if (errors !== null) {
					acc.errors.push(errors)
					return acc
				}
				acc.data.push(data)
				return acc
			},
			{ errors: [], data: [] }
		)
	)
	if (errors.length > 0) {
		error(...errFmt(errors[0]))
	}

	const [ckan_users_errors, ckan_users] = await userServiceGetUsersController({
		configuration: locals.configuration,
		session: locals.session
	})

	if (ckan_users_errors !== null) {
		error(...errFmt(ckan_users_errors))
	}

	const filtered_ckan_users = ckan_users.items.filter((user) => user.sysadmin !== true)

	const api_keys = await Promise.all(
		filtered_ckan_users.map((user) =>
			userServiceGetUserApiKeysController({
				id: user.id,
				configuration: locals.configuration,
				session: locals.session
			})
		)
	).then((res) =>
		res.reduce(
			(acc, [errors, data]) => {
				if (errors !== null) {
					acc.errors.push(errors)
					return acc
				}
				acc.data.push(data)
				return acc
			},
			{ errors: [], data: [] } as { errors: ErrTypes[]; data: UserServiceApiToken[][] }
		)
	)
	if (api_keys.errors.length > 0) {
		error(...errFmt(api_keys.errors[0]))
	}

	return {
		api_keys: api_keys.data.flatMap((key) => key),
		ckan_users: filtered_ckan_users,
		superusers: data,
		configuration: locals.configuration
	}
}
