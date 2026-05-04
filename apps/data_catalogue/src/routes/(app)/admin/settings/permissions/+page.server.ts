import { permissionsCreateUseCase } from '$lib/server/application/use_cases/permissions/create.js'
import { permissionsDeleteUseCase } from '$lib/server/application/use_cases/permissions/delete.js'
import type { PermissionRequest } from '$lib/server/entities/models/permissions.js'
import { permissionCreateController } from '$lib/server/interface/adapters/controllers/permissions/create'
import {
	permissionDeleteController,
	permissionResetNamespaceController,
	permissionsDeleteController
} from '$lib/server/interface/adapters/controllers/permissions/delete.js'
import { permissionsGetController } from '$lib/server/interface/adapters/controllers/permissions/get.js'
import { formGetStringOrUndefined, safeJSONParse } from '$lib/utils/forms'
import { jstr } from '@arturoguzman/art-ui'
import { error } from '@sveltejs/kit'
import { fail } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	const [permissions, dataset_permissions, group_permissions, resources_permissions] =
		await Promise.all([
			permissionsGetController({
				session: locals.session,
				configuration: locals.configuration,
				data: { namespace: 'Action' }
			}).then(([errors, permissions]) => {
				if (errors !== null) {
					error(500, { message: errors.reason, id: errors.reason })
				}
				return permissions
			}),
			permissionsGetController({
				session: locals.session,
				configuration: locals.configuration,
				data: { namespace: 'Dataset' }
			}).then(([errors, permissions]) => {
				if (errors !== null) {
					error(500, { message: errors.reason, id: errors.reason })
				}
				return permissions
			}),
			permissionsGetController({
				session: locals.session,
				configuration: locals.configuration,
				data: { namespace: 'Group' }
			}).then(([errors, permissions]) => {
				if (errors !== null) {
					error(500, { message: errors.reason, id: errors.reason })
				}
				return permissions
			}),
			permissionsGetController({
				session: locals.session,
				configuration: locals.configuration,
				data: { namespace: 'Resource' }
			}).then(([errors, permissions]) => {
				if (errors !== null) {
					error(500, { message: errors.reason, id: errors.reason })
				}
				return permissions
			})
		])

	return {
		permissions,
		dataset_permissions,
		group_permissions,
		resources_permissions
	}
}

export const actions = {
	create: async ({ request, locals }) => {
		const form = await request.formData()
		const payload: PermissionRequest = {
			actor: safeJSONParse(formGetStringOrUndefined({ form, field: 'actor' })),
			namespace: formGetStringOrUndefined({ form, field: 'namespace' }),
			object: formGetStringOrUndefined({ form, field: 'object' }),
			relation: formGetStringOrUndefined({ form, field: 'relation' })
		}
		console.log(payload)
		const [errors, permission] = await permissionCreateController({
			configuration: locals.configuration,
			session: locals.session,
			data: payload
		})
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.message ?? errors.reason })
		}
		console.log(jstr(permission))
		return {
			message: 'ok'
		}
	},

	delete: async ({ request, locals }) => {
		const form = await request.formData()
		const payload: PermissionRequest = {
			actor: safeJSONParse(formGetStringOrUndefined({ form, field: 'actor' })),
			namespace: formGetStringOrUndefined({ form, field: 'namespace' }),
			object: formGetStringOrUndefined({ form, field: 'object' }),
			relation: formGetStringOrUndefined({ form, field: 'relation' })
		}
		const [errors, permission] = await permissionDeleteController({
			configuration: locals.configuration,
			session: locals.session,
			data: payload
		})
		if (errors !== null) {
			return fail(500, { message: errors.message ?? errors.reason })
		}
		console.log(jstr(permission))
		return {
			message: 'ok'
		}
	},

	reset: async ({ request, locals }) => {
		const form = await request.formData()
		const namespace = formGetStringOrUndefined({ form, field: 'namespace' })
		const [errors, permission] = await permissionResetNamespaceController({
			configuration: locals.configuration,
			session: locals.session,
			namespace
		})
		if (errors !== null) {
			return fail(500, { message: errors.message ?? errors.reason })
		}
		console.log(jstr(permission))
		return {
			message: 'ok'
		}
	}
}
