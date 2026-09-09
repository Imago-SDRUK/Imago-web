import { form, getRequestEvent, query } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import {
	productGetController,
	productGetOptionsController
} from '$lib/server/interface/adapters/controllers/products/get'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const productGet = form(
	type({
		id: 'string'
	}),
	async ({ id }) => {
		const { locals } = getRequestEvent()
		const [errors, product] = await productGetController({
			id,
			session: locals.session,
			configuration: locals.configuration
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			product
		}
	}
)

export const productGetOptions = query(type({ id: 'string' }), async ({ id }) => {
	const { locals } = getRequestEvent()
	const [errors, options] = await productGetOptionsController({
		id,
		session: locals.session,
		configuration: locals.configuration
	})
	if (errors !== null) {
		console.log(errors)
		error(...errFmt(errors))
	}
	return options ?? []
})
