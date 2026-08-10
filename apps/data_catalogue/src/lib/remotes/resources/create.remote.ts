import { form, getRequestEvent } from '$app/server'
import { resourceCreateControllerWithVersion } from '$lib/server/interface/adapters/controllers/resources/create'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'
import MimeTypes from '$lib/assets/available_mime_types.json'

export const createResource = form(
	type({
		name: 'string > 1',
		'description?': 'string',
		mimetype: 'string > 1',
		package_id: 'string > 1',
		'changelog?': 'string',
		size: 'number',
		version: 'string.semver'
	}),
	async ({ name, description, mimetype, package_id, changelog, version, size }) => {
		const { locals } = getRequestEvent()
		const [errors, file_version] = await resourceCreateControllerWithVersion({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				description,
				mimetype,
				package_id,
				size: String(size),
				format: MimeTypes.find((mt) => mt.value === mimetype)?.format ?? undefined
			},
			version_data: {
				changelog,
				version
			}
		})
		if (errors !== null) {
			error(500, { message: errors.message ?? errors.reason, id: '' })
		}
		return {
			message: 'Resource created, uploading file',
			url: file_version.url
		}
	}
)
