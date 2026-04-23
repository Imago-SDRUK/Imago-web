import { resourceGetController } from '$lib/server/interface/adapters/controllers/resources/get.js'
import { error, redirect } from '@sveltejs/kit'
export const load = async ({ locals, params }) => {
	const [errors, resource] = await resourceGetController({
		configuration: locals.configuration,
		session: locals.session,
		id: params.resource
	})
	if (errors !== null) {
		if (errors.reason === 'Unauthenticated') {
			return redirect(307, `/auth/login`)
		}
		return error(400, { message: errors.reason, id: errors.reason })
	}
	return { resource }
}
