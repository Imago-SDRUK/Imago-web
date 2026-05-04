import type { PageServerLoadEvent } from './$types.js'
import { fail, redirect } from '@sveltejs/kit'
import { parseForm } from '$lib/utils/forms/index.js'
import { error } from '@sveltejs/kit'
import { questionsGetController } from '$lib/server/interface/adapters/controllers/questions/get.js'
import { answersCreateController } from '$lib/server/interface/adapters/controllers/answers/create.js'
import { userUpdateController } from '$lib/server/interface/adapters/controllers/users/update.js'
import { userGetMeController } from '$lib/server/interface/adapters/controllers/users/get.js'

export const load = async ({ locals }: PageServerLoadEvent) => {
	const [errors, me] = await userGetMeController({
		configuration: locals.configuration,
		session: locals.session
	})
	if (errors !== null) {
		return error(500, { message: errors.reason, id: errors.reason })
	}
	if (me.status === 'active') {
		redirect(307, '/')
	}
	const [errs, questions] = await questionsGetController({
		configuration: locals.configuration,
		session: locals.session
	})
	if (errs) {
		return error(500, { message: errs.reason, id: errs.reason })
	}
	return { questions }
}

export const actions = {
	create: async ({ request, locals }) => {
		const form = parseForm(await request.formData())
		const body = Object.entries(form).map(([key, value]) => ({
			question_id: key,
			answer: value
		}))
		const [errors] = await answersCreateController({
			configuration: locals.configuration,
			data: body,
			session: locals.session
		})
		if (errors !== null) {
			console.log(errors)
			return fail(400, { message: errors.message ?? errors.reason, id: errors.reason })
		}
		const [errs] = await userUpdateController({
			configuration: locals.configuration,
			session: locals.session,
			id: locals.session?.identity.id,
			payload: { status: 'active' }
		})
		if (errs !== null) {
			console.log(errs)
			return fail(400, { message: errs.message ?? errs.reason, id: errs.reason })
		}
		return redirect(307, '/')
	}
}
