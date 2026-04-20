import { ketoCheck } from '$lib/utils/auth/index.js'
import { error } from '@sveltejs/kit'

export const load = async ({ locals, params }) => {
	const subroutes: { label: string; href: string }[] = []
	/**
	 * TODO: get dataset and check if the dataset is restricted via private or status, and if the user is memeber of the group where the dataset is allowed
	 **/
	if (locals.session?.identity.id) {
		const permission = await ketoCheck.checkPermission({
			subjectId: locals.session?.identity.id,
			relation: 'read',
			namespace: 'Dataset',
			object: params.id
		})
		if (!permission) {
			error(401, { message: 'Unauthorised', id: 'Unauthorised' })
		}
		const edit_permission = await ketoCheck.checkPermission({
			subjectId: locals.session?.identity.id,
			relation: 'edit',
			namespace: 'Dataset',
			object: params.id
		})
		if (edit_permission.allowed) {
			subroutes.push({ label: 'Preview', href: `/datasets/${params.id}` })
			subroutes.push({ label: 'Edit', href: `/datasets/${params.id}/edit` })
		}
	}

	return {
		subroutes
	}
}
