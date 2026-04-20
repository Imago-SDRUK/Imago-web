import type { PageServerLoadEvent } from './$types.js'
import { error, redirect } from '@sveltejs/kit'
import { handleOryResponse } from '$lib/utils/auth/index.js'
import { env } from '$env/dynamic/private'
import { log } from '$lib/utils/server/logger.js'
import { userGetMeController } from '$lib/server/interface/adapters/controllers/users/get.js'
const FLOW = 'settings'
export const load = async ({ url, request, cookies, fetch, locals }: PageServerLoadEvent) => {
	const [errors, user] = await userGetMeController({
		id: locals.session?.identity.id,
		session: locals.session
	})
	console.log(user)
	if (errors !== null) {
		if (errors.reason === 'Not Found') {
			redirect(307, '/user/register')
		}
		error(400, { message: errors.reason, id: errors.reason })
	}

	const cookie = request.headers.get('cookie') || ''
	const flow_id = url.searchParams.get('flow')
	// // const return_to = url.searchParams.get('return_to')
	if (!flow_id) {
		const endpoint = `${env.IDENTITY_SERVER_PUBLIC}/self-service/${FLOW}/browser`
		redirect(307, endpoint)
	}
	const endpoint = `${env.IDENTITY_SERVER_PUBLIC}/self-service/${FLOW}/flows?id=${flow_id}`
	const res = await fetch(endpoint, {
		credentials: 'include',
		headers: { cookie }
	})
	const data = await handleOryResponse(res)
	if ('error' in data) {
		if (data.error.id === 'custom error') {
			redirect(307, '/')
		}
		if (data.error.id === 'security_csrf_violation') {
			cookies.getAll().forEach((cookie) => log.debug(cookie))
			log.debug(request.headers)
			redirect(307, '/')
		}
		const redirect_to = data.error?.details?.redirect_to
		if (redirect_to) {
			const endpoint = `${env.IDENTITY_SERVER_PUBLIC}/self-service/${FLOW}/browser`
			redirect(307, endpoint)
		}
		redirect(307, `/`)
	}
	// url.searchParams.delete('flow_id')
	return {
		form: data.ui
	}
}
