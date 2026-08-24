import { formGetStringOrUndefined, safeJSONParse } from '$lib/utils/forms/index.js'
import { error, fail } from '@sveltejs/kit'
import { questionUpdateController } from '$lib/server/interface/adapters/controllers/questions/update.js'
import { applicationGetQuestionsController } from '$lib/server/interface/adapters/controllers/application/get.js'
import { permissionsCheckController } from '$lib/server/interface/adapters/controllers/permissions/get.js'

export const load = async ({ locals }) => {
	let allow_manage = false
	const [check_errs, check] = await permissionsCheckController({
		permissions: [{ namespace: 'Application', object: 'registration', permits: 'manage' }],
		configuration: locals.configuration,
		session: locals.session
	})
	if (check_errs === null) {
		if (check.results.every((check) => check.allowed)) {
			allow_manage = true
		}
	}
	const [errors, questions] = await applicationGetQuestionsController({
		session: locals.session,
		configuration: locals.configuration
	})
	if (errors !== null) {
		error(500, { message: errors.reason, id: errors.reason })
	}
	return {
		allow_manage,
		questions
	}
}

export const actions = {
	// TODO: move this to remote fn
	update_question: async ({ request, locals }) => {
		const form = await request.formData()
		const id = formGetStringOrUndefined({ form, field: 'id' })
		const data = safeJSONParse(formGetStringOrUndefined({ form, field: 'question_data' }))
		const [errors, question] = await questionUpdateController({
			configuration: locals.configuration,
			session: locals.session,
			data,
			id
		})
		if (errors !== null) {
			return fail(400, { message: errors.message ?? errors.reason })
		}
		console.log(question)
		return {
			message: `Question updated`
		}
	}
}
