import { json } from '@sveltejs/kit'
import { userCreateController } from '$lib/server/interface/adapters/controllers/users/create.js'
/**
 * NOTE: This endpoint will be hit by Kratos to create a user
 **/
export const POST = async ({ locals, request }) => {
	const body = await request.json()
	const user = await userCreateController({
		session: locals.session,
		payload: body,
		configuration: locals.configuration,
		identity_token: locals.identity_token
	})
	return json({ data: user })
}
