import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { resourceServiceUpdateController } from '$lib/server/interface/adapters/controllers/resources/update'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'
import MimeTypes from '$lib/assets/available_mime_types.json'

export const updateResourceService = form(
	type({
		id: 'string',
		name: 'string > 1',
		'description?': 'string',
		mimetype: 'string > 1'
	}),
	async ({ id, name, description, mimetype }) => {
		const { locals } = getRequestEvent()
		const [errors] = await resourceServiceUpdateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				description,
				mimetype,
				format: MimeTypes.find((mt) => mt.value === mimetype)?.format ?? undefined
			},
			id
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			message: 'Resource updated'
		}
	}
)
