import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { questionCreateController } from '$lib/server/interface/adapters/controllers/questions/create'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const createQuestion = form(
	type({
		question: 'string',
		'description?': 'string',
		'required?': 'boolean',
		'sort?': 'string',
		'label?': 'string',
		'type?': ' "string" | "number" | "select" | "multiple_select" | "bool" | "countries"  ',
		'options?': type({ label: 'string', value: 'string' }).array(),
		'conditionals?': type({
			question: 'string',
			value: 'string',
			operator: '"equal" | "not_equal" | "includes"',
			action: type('string').array()
		}).array(),
		'visibility?': 'boolean',
		'status?': '"archived" | "draft" | "published"'
	}),
	async ({
		question,
		description,
		required,
		sort,
		label,
		type,
		options,
		conditionals,
		visibility,
		status
	}) => {
		const { locals } = getRequestEvent()
		const [errors] = await questionCreateController({
			configuration: locals.configuration,
			session: locals.session,
			data: {
				question,
				description,
				required: required ?? false,
				sort,
				label,
				conditionals: conditionals?.map((conditional) => ({
					...conditional,
					action: conditional.action.flatMap((action) => action.split(','))
				})),
				group: '',
				options,
				status,
				type,
				visibility
			}
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			message: 'Question created'
		}
	}
)

// create_question: async ({ request, locals }) => {
// 		const form = await request.formData()
// 		const data = safeJSONParse(formGetStringOrUndefined({ form, field: 'question_data' }))
// 		if (errors !== null) {
// 			return fail(400, { message: errors.message ?? errors.reason })
// 		}
// 		console.log(question)
// 		return {
// 			message: `Question created`
// 		}
// 	},
// 	update_question: async ({ request, locals }) => {
// 		const form = await request.formData()
// 		const id = formGetStringOrUndefined({ form, field: 'id' })
// 		const data = safeJSONParse(formGetStringOrUndefined({ form, field: 'question_data' }))
// 		const [errors, question] = await questionUpdateController({
// 			configuration: locals.configuration,
// 			session: locals.session,
// 			data,
// 			id
// 		})
// 		if (errors !== null) {
// 			return fail(400, { message: errors.message ?? errors.reason })
// 		}
// 		console.log(question)
// 		return {
// 			message: `Question updated`
// 		}
// 	},
// 	delete_question: async ({ request, locals }) => {
// 		const form = await request.formData()
// 		const id = formGetStringOrUndefined({ form, field: 'id' })
// 		const [errors, question] = await questionDeleteController({
// 			configuration: locals.configuration,
// 			session: locals.session,
// 			id
// 		})
// 		if (errors !== null) {
// 			return fail(400, { message: errors.message ?? errors.reason })
// 		}
// 		console.log(question)
// 		return {
// 			message: `Question deleted`
// 		}
// 	}
