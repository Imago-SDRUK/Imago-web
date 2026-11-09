import { error, json } from '@sveltejs/kit'
import type {
	ProductResourceUpdateComplete,
	ProductResourceUpdateMessage
} from '$lib/server/entities/models/products.js'
import { productResourceUpdateController } from '$lib/server/interface/adapters/controllers/products/update.js'
import { errFmt } from '$lib/server/entities/errors.js'

export const POST = async ({ params, locals, request }) => {
	const body = (await request.json()) as
		ProductResourceUpdateComplete | ProductResourceUpdateMessage
	const [errors, result] = await productResourceUpdateController({
		configuration: locals.configuration,
		session: locals.session,
		data: body,
		id: params.id
	})
	if (errors !== null) {
		error(...errFmt(errors))
	}
	console.log(result)

	return json({
		message: 'ok'
	})
}
