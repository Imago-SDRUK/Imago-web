import { applicationCheckPermissionController } from '$lib/server/interface/adapters/controllers/application/get.js'
import { metadataGroupsGetController } from '$lib/server/interface/adapters/controllers/metadata_groups/get.js'
import { error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	const [errors_permission, allow_create] = await applicationCheckPermissionController({
		object: 'datasets',
		permits: 'manage',
		configuration: locals.configuration,
		session: locals.session
	})
	if (errors_permission !== null) {
		error(400, {
			message: errors_permission.reason,
			id: errors_permission.reason
		})
	}
	const [errors, groups] = await metadataGroupsGetController({
		configuration: locals.configuration,
		session: locals.session
	})
	if (errors) {
		error(400, { message: `There's been an issue retreiving the groups`, id: 'err' })
	}
	return {
		allow_create,
		groups: groups
	}
}
