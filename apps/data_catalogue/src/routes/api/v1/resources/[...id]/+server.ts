import { resourceVersionDownloadController } from '$lib/server/interface/adapters/controllers/resources/get.js'
import { error, redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
export const GET = async ({ params, locals, url }) => {
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
		if (errors.reason === 'Unauthenticated' || errors.reason === 'Unauthorised') {
			const dataset = url.searchParams.get('dataset')
			const login_endpoint = dataset
				? `${env.IDENTITY_SERVER_PUBLIC}/self-service/login/browser?return_to=/datasets/${dataset}/resources/${params.id}`
				: `${env.IDENTITY_SERVER_PUBLIC}/self-service/login/browser`
			redirect(307, login_endpoint)
		}
		error(400, { message: errors.reason, id: errors.reason })
	}
	return fetch(signed_url)
	/**
	 * NOTE: this will open the resource on the same tab
	 **/
	// return redirect(303, signed_url)
}
