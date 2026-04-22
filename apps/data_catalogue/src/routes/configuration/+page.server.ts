import { configurationInitialiseController } from '$lib/server/interface/adapters/controllers/configuration/create.js'
import { formGetStringOrNull } from '$lib/utils/forms/index.js'
import { redirect } from '@sveltejs/kit'
import { fail } from '@sveltejs/kit'

export const actions = {
	initialise: async ({ locals, request }) => {
		const form = await request.formData()
		if (locals.configuration) {
			fail(500, { message: `This application has already been initialised` })
		}
		const first_name = formGetStringOrNull({ form, field: 'first_name' })
		const last_name = formGetStringOrNull({ form, field: 'last_name' })
		const email = formGetStringOrNull({ form, field: 'email' })
		const password = formGetStringOrNull({ form, field: 'password' })
		const confirm_password = formGetStringOrNull({ form, field: 'confirm_password' })
		if (!first_name || !last_name || !email || !password || !confirm_password) {
			return fail(500, { message: `You need to provide the full information.` })
		}
		if (password !== confirm_password) {
			return fail(400, { message: `Please check your passwords` })
		}
		const data = {
			identity: {
				first_name: first_name,
				last_name: last_name,
				email: email,
				password: password
			}
		}
		const [errors, init] = await configurationInitialiseController({ data })
		if (errors !== null) {
			return fail(500, { message: errors.reason })
		}
		if (init === null) {
			return fail(500, {
				message: `There's been an error initialising the application. Please try again`
			})
		}
		redirect(307, '/')
	}
}
