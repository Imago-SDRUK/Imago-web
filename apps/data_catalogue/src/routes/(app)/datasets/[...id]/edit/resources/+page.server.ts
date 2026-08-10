import { formGetStringOrUndefined, safeJSONParse } from '$lib/utils/forms/index.js'
import { datastoreUpdateController } from '$lib/server/interface/adapters/controllers/datastore/update.js'
import {
	resourceAddVersionController,
	resourceUpdateController,
	resourceVersionUpdateController
} from '$lib/server/interface/adapters/controllers/resources/update.js'
import { error, fail } from '@sveltejs/kit'
import {
	resourceDeleteController,
	resourceVersionDeleteController
} from '$lib/server/interface/adapters/controllers/resources/delete.js'
import { resourceGetController } from '$lib/server/interface/adapters/controllers/resources/get.js'
import type {
	Resource,
	ResourceServiceDto,
	ResourceVersion
} from '$lib/server/entities/models/resources.js'
import type { CSVW } from '$lib/types/csvw.js'
import { err, errFmt, ok } from '$lib/server/entities/errors.js'
import { datastoreCreateController } from '$lib/server/interface/adapters/controllers/datastore/create.js'
import { jstr } from '@arturoguzman/art-ui'
import { datastoreResetController } from '$lib/server/interface/adapters/controllers/datastore/delete.js'
import { permissionCheckController } from '$lib/server/interface/adapters/controllers/permissions/get.js'

export const load = async ({ locals, parent, url }) => {
	const { permits, dataset } = await parent()
	if (!permits.includes('edit')) {
		error(401, { message: 'Unauthorised', id: 'Unauthorised' })
	}

	let resource:
		| (ResourceServiceDto & {
				resource: Resource
				versions: ResourceVersion[]
				metadata: CSVW | null
		  })
		| null = null
	const edit = url.searchParams.get('edit')
	let allow_delete = false
	if (edit) {
		resource = await resourceGetController({
			id: edit,
			configuration: locals.configuration,
			session: locals.session
		}).then(([errors, users]) => {
			if (errors !== null) {
				error(...errFmt(errors))
			}
			return users
		})
		const [allow_errors, allow] = await permissionCheckController({
			configuration: locals.configuration,
			session: locals.session,
			permission: {
				namespace: 'Resource',
				object: edit,
				permits: 'delete'
			}
		})
		allow_delete = allow?.allowed ?? false
	}
	return {
		dataset,
		resource,
		allow_delete
	}
}

// type FormField = { name: string; type: 'string' | 'file' | 'boolean' | 'array'; required: boolean }

const parseForm = (form: FormData) => {
	const object: Record<PropertyKey, unknown> = {}
	form.forEach((value, key) => {
		// Reflect.has in favor of: object.hasOwnProperty(key)
		if (key in object === false) {
			object[key] = value
			return
		}
		if (!Array.isArray(object[key])) {
			object[key] = [object[key]]
		}
		if (Array.isArray(object[key])) {
			object[key].push(value)
		}
	})
	return object
}

export const actions = {
	update_resource: async ({ request, params, locals }) => {
		const form = await request.formData()
		const parsed = parseForm(form)
		await resourceUpdateController({
			configuration: locals.configuration,
			id: params.id,
			session: locals.session,
			data: parsed
		})
		return {
			message: `Resource successfully updated`
		}
	},
	add_datastore: async ({ request, locals }) => {
		const form = await request.formData()
		const id = formGetStringOrUndefined({ form, field: 'id' })
		const file = form.get('file')
		if (!file || typeof file === 'string') {
			return fail(400, { message: 'File must be a file' })
		}
		const [blob_err, blob] = await file
			.text()
			.then((res) => ok(safeJSONParse(res)))
			.catch((_err) => err({ reason: 'Unexpected', error: _err }))
		if (blob_err !== null) {
			return fail(500, { message: blob_err.reason, id: blob_err.reason })
		}
		const [errors, data] = await datastoreCreateController({
			configuration: locals.configuration,
			session: locals.session,
			metadata: blob,
			resource_id: id
		})
		if (errors !== null) {
			console.log(errors)
			return fail(400, { message: errors.message ?? errors.reason })
		}
		console.log(jstr(data))
		return {
			message: `Datastore updated`
		}
	},
	update_datastore: async ({ request, locals }) => {
		const form = await request.formData()
		const id = formGetStringOrUndefined({ form, field: 'id' })
		const metadata = parseForm(form)
		await datastoreUpdateController({
			configuration: locals.configuration,
			session: locals.session,
			metadata,
			resource_id: id
		})
		return {
			message: `Datastore updated`
		}
	},
	reset_datastore: async ({ request, locals }) => {
		const form = await request.formData()
		const id = formGetStringOrUndefined({ form, field: 'id' })
		const [errors] = await datastoreResetController({
			configuration: locals.configuration,
			session: locals.session,
			resource_id: id
		})

		if (errors !== null) {
			console.log(errors)
			return fail(400, { message: errors.message ?? errors.reason })
		}
		return {
			message: `Datastore updated`
		}
	},
	delete_resource: async ({ request, locals }) => {
		const form = await request.formData()
		const resource_id = formGetStringOrUndefined({ form, field: 'resource_id' })
		const [errors, resource] = await resourceDeleteController({
			session: locals.session,
			configuration: locals.configuration,
			resource_id
		})
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.message ?? errors.reason })
		}
		console.log(resource)
		return {
			message: 'Resource deleted'
		}
	},
	add_version: async ({ request, locals }) => {
		const form = await request.formData()
		const resource_id = formGetStringOrUndefined({ form, field: 'resource_id' })
		const version = formGetStringOrUndefined({ form, field: 'version' })
		const changelog = formGetStringOrUndefined({ form, field: 'changelog' })
		const [errors, url] = await resourceAddVersionController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				resource: resource_id,
				version: version,
				changelog: changelog
			}
		})
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.message ?? errors.reason })
		}
		console.log(url)
		return {
			message: 'Resource version created',
			url
		}
	},
	update_version: async ({ request, locals }) => {
		const form = await request.formData()
		const version_id = formGetStringOrUndefined({ form, field: 'version_id' })
		const version = formGetStringOrUndefined({ form, field: 'version' })
		const changelog = formGetStringOrUndefined({ form, field: 'changelog' })
		if (!version_id) {
			return fail(400, { message: 'Provide a version id' })
		}
		const [errors, url] = await resourceVersionUpdateController({
			session: locals.session,
			configuration: locals.configuration,
			version_id,
			data: {
				version: version,
				changelog: changelog
			}
		})
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.message ?? errors.reason })
		}
		console.log(url)
		return {
			message: 'Resource version updated',
			url
		}
	},
	delete_version: async ({ request, locals }) => {
		const form = await request.formData()
		const version_id = formGetStringOrUndefined({ form, field: 'version_id' })
		if (!version_id) {
			return fail(400, { message: 'Provide a version id' })
		}
		const [errors, url] = await resourceVersionDeleteController({
			session: locals.session,
			configuration: locals.configuration,
			version_id
		})
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.message ?? errors.reason })
		}
		console.log(url)
		return {
			message: 'Resource version deleted',
			url
		}
	}
}
