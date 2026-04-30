import { downloadCreateController } from '$lib/server/interface/adapters/controllers/downloads/create.js'
import { resourceVersionDownloadController } from '$lib/server/interface/adapters/controllers/resources/get.js'
import { log } from '$lib/utils/server/logger.js'
import { error, redirect } from '@sveltejs/kit'

export const GET = async ({ params, locals, url }) => {
	if (locals.session?.identity.id === 'anonymous') {
		redirect(307, '/auth/login')
	}
	const version_id = url.searchParams.get('version')
	if (!version_id) {
		error(400, { message: `You need to provide an version`, id: 'missing-version' })
	}
	const [errors, signed_url] = await resourceVersionDownloadController({
		version_id: version_id,
		resource_id: params.id,
		configuration: locals.configuration,
		session: locals.session
	})
	if (errors !== null) {
		console.log(errors)
		error(400, { message: errors.reason, id: errors.reason })
	}
	const [download_errors] = await downloadCreateController({
		configuration: locals.configuration,
		session: locals.session,
		resource_id: params.id,
		version_id
	})

	if (download_errors !== null) {
		log.error({ message: 'Error registering the download' })
	}

	return fetch(signed_url)
	/**
	 * NOTE: this will open the resource on the same tab
	 **/
	// return redirect(303, signed_url)
}
