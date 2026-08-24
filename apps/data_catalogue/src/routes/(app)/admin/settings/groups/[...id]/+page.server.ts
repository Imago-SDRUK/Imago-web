import { error } from '@sveltejs/kit'
import {
	groupGetController,
	groupGetUsersController
} from '$lib/server/interface/adapters/controllers/groups/get.js'
import {
	permissionsCheckController,
	permissionsGetController
} from '$lib/server/interface/adapters/controllers/permissions/get.js'

export const load = async ({ locals, params }) => {
	let allow_manage = false
	const [check_errs, check] = await permissionsCheckController({
		permissions: [{ namespace: 'Application', object: 'groups', permits: 'manage' }],
		configuration: locals.configuration,
		session: locals.session
	})
	if (check_errs === null) {
		if (check.results.every((check) => check.allowed)) {
			allow_manage = true
		}
	}

	const [group, group_users, group_permissions_settings] = await Promise.all([
		await groupGetController({
			configuration: locals.configuration,
			session: locals.session,
			id: params.id,
			permissions: [{ namespace: 'Application', object: 'groups', permits: 'read' }]
		}).then(([errors, users]) => {
			if (errors !== null) {
				error(500, { message: errors.reason, id: errors.reason })
			}
			return users
		}),
		await groupGetUsersController({
			configuration: locals.configuration,
			session: locals.session,
			group_id: params.id
		}).then(([errors, users]) => {
			if (errors !== null) {
				error(500, { message: errors.reason, id: errors.reason })
			}
			return users
		}),
		await permissionsGetController({
			configuration: locals.configuration,
			session: locals.session,
			data: {
				namespace: 'Application',
				actor: { namespace: 'Group', object: params.id, relation: 'members' }
			}
		}).then(([errors, users]) => {
			if (errors !== null) {
				error(500, { message: errors.reason, id: errors.reason })
			}
			return users
		})
	])

	return {
		allow_manage,
		group_users,
		group,
		group_permissions_settings
	}
}
