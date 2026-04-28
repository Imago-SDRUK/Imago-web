import { db } from '$lib/db/index.js'
import { questions } from '$lib/server/entities/models/questions.js'
import { SERVER_ERRORS } from '$lib/globals/server.js'
import { handleDBError } from '$lib/utils/db/index.js'
import { parseForm } from '$lib/utils/forms/index.js'
import { log } from '$lib/utils/server/logger.js'
import { jstr } from '@arturoguzman/art-ui'
import { error, fail } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'

export const load = async () => {
	const records = await db
		.select()
		.from(questions)
		.orderBy(asc(questions.created_at))
		.catch((err) => {
			log.debug(err)
			error(...SERVER_ERRORS[500])
		})

	return {
		questions: records ?? []
	}
}

export const actions = {
	create_question: async ({ request, locals, fetch }) => {
		if (!locals.session) {
			redirect(307, '/')
		}
		const form = {
			...parseForm(await request.formData()),
			created_by: locals.session.identity.id,
			updated_by: locals.session.identity.id,
			group: 'registration'
		}
		if ('required' in form && form.required === 'on') {
			form.required = true
		} else {
			form['required'] = false
		}
		if ('visibility' in form && form.visibility === 'on') {
			form.visibility = true
		} else {
			form['visibility'] = false
		}
		if ('options' in form && typeof form.options === 'string') {
			form.options = JSON.parse(form.options)
		}

		if (
			'conditionals' in form &&
			typeof form.conditionals === 'string' &&
			form.conditionals === '[]'
		) {
			form.conditionals = []
		}

		const res = await fetch('/api/v1/questions', { method: 'POST', body: JSON.stringify(form) })
		const data = await res.json()
		return {
			message: `Question created`
		}
	},
	update_question: async ({ request, locals, fetch }) => {
		if (!locals.session) {
			redirect(307, '/')
		}
		const form = parseForm(await request.formData())

		if ('id' in form == false) {
			return fail(400, { message: 'You need to provide an ID' })
		}
		if ('required' in form && form.required === 'on') {
			form.required = true
		} else {
			form['required'] = false
		}
		if ('visibility' in form && form.visibility === 'on') {
			form.visibility = true
		} else {
			form['visibility'] = false
		}
		if ('options' in form && typeof form.options === 'string') {
			form.options = JSON.parse(form.options)
		}
		if (
			'conditionals' in form &&
			typeof form.conditionals === 'string' &&
			form.conditionals === '[]'
		) {
			form.conditionals = []
		}
		const res = await fetch(`/api/v1/questions/${form.id}`, {
			method: 'PATCH',
			body: JSON.stringify(form)
		})
		const data = await res.json()
		log.debug(data)
		return {
			message: `Question updated`
		}
	},
	delete_question: async ({ request, locals }) => {
		if (!locals.session) {
			redirect(307, '/')
		}
		const form = parseForm(await request.formData())
		if ('id' in form) {
			await db.delete(questions).where(eq(questions.id, form.id)).catch(handleDBError)
			return {
				message: `Question deleted`
			}
		}
		return fail(400, { message: `There's been an issue deleting this question` })
	}
}
