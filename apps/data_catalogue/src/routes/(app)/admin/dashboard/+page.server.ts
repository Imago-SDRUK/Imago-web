import { downloadsGetAggregatesController } from '$lib/server/interface/adapters/controllers/downloads/get'
import { error } from '@sveltejs/kit'

export const load = async ({ locals, url }) => {
	const from = url.searchParams.get('from')
	const to = url.searchParams.get('to')
	const [downloads_errors, downloads] = await downloadsGetAggregatesController({
		configuration: locals.configuration,
		session: locals.session,
		from,
		to
	})
	if (downloads_errors !== null) {
		return error(500, { message: downloads_errors.reason, id: downloads_errors.reason })
	}
	return {
		downloads
	}
}
