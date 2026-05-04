import { formGetStringOrUndefined, safeJSONParse } from '$lib/utils/forms/index.js'
import { error, fail } from '@sveltejs/kit'
import { questionsGetController } from '$lib/server/interface/adapters/controllers/questions/get.js'
import { questionCreateController } from '$lib/server/interface/adapters/controllers/questions/create.js'
import { questionUpdateController } from '$lib/server/interface/adapters/controllers/questions/update.js'
import { questionDeleteController } from '$lib/server/interface/adapters/controllers/questions/delete.js'

export const load = async ({ locals }) => {
	const [errors, questions] = await questionsGetController({
		session: locals.session,
		configuration: locals.configuration
	})
	if (errors !== null) {
		error(500, { message: errors.reason, id: errors.reason })
	}
	return {
		questions
	}
}

export const actions = {
	create_question: async ({ request, locals }) => {
		const form = await request.formData()
		const data = safeJSONParse(formGetStringOrUndefined({ form, field: 'question_data' }))
		const [errors, question] = await questionCreateController({
			configuration: locals.configuration,
			session: locals.session,
			data
		})
		if (errors !== null) {
			return fail(400, { message: errors.message ?? errors.reason })
		}
		console.log(question)
		return {
			message: `Question created`
		}
	},
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
	},
	delete_question: async ({ request, locals }) => {
		const form = await request.formData()
		const id = formGetStringOrUndefined({ form, field: 'id' })
		const [errors, question] = await questionDeleteController({
			configuration: locals.configuration,
			session: locals.session,
			id
		})
		if (errors !== null) {
			return fail(400, { message: errors.message ?? errors.reason })
		}
		console.log(question)
		return {
			message: `Question deleted`
		}
	}
}
