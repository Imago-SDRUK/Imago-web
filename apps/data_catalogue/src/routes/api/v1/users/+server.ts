import { error, json } from '@sveltejs/kit'
import { userCreateController } from '$lib/server/interface/adapters/controllers/users/create.js'
import { errFmt } from '$lib/server/entities/errors.js'
import { log } from '$lib/utils/server/logger.js'
import { COOKIES } from '$lib/globals/server.js'
/**
 * NOTE: This endpoint will be hit by Kratos to create a user
 **/
export const POST = async ({ locals, request, cookies }) => {
	const body = await request.json()
	const identity_token = cookies.get(COOKIES.identity_token)
	const [errors, user] = await userCreateController({
		session: locals.session,
		payload: body,
		configuration: locals.configuration,
		identity_token: identity_token
	})
	if (errors !== null) {
		log.error(`Error creating user`)
		log.error(errors)
		error(...errFmt(errors))
	}
	return json({ data: user })
}
