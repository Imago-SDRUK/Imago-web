import { env } from '$env/dynamic/private'
import type { CkanPing } from '$lib/types/ckan/index.js'
import { handleCKANResponse } from '$lib/utils/ckan/ckan.js'
import { json, redirect, error } from '@sveltejs/kit'
const ALLOWED_PATHS = [
	'package_list',
	'current_package_list_with_resources',
	'package_show',
	'package_search',
	'package_collaborator_list',
	'group_list',
	'group_show',
	'group_package_show',
	'organization_list',
	'organization_show',
	'resource_search',
	'tag_list',
	'tag_show',
	'config_option_show',
	'config_option_list',
	'vocabulary_list',
	'vocabulary_show',
	'resource_view_show',
	'resource_view_list',
	'license_list',
	'term_translation_show',
	'package_relationships_list',
	'tag_search'
]
export async function GET({ params, url, request }) {
	if (params.path === '') {
		redirect(307, '/')
	}
	if (!ALLOWED_PATHS.includes(params.path)) {
		error(404, { message: `Not found`, id: '' })
	}
	const auth_header = request.headers.get('Authorization')
	if (!auth_header) {
		return error(401, { message: 'Unauthorised', id: 'unauthorised' })
	}
	// HACK: check this url to check auth token is valid
	const ping_url = new URL(`${env.CKAN_URL}/api/action/am_following_user?id=metadataworks`)
	const headers = new Headers()
	headers.set('Authorization', auth_header)
	let success = false
	try {
		const res = await fetch(ping_url, { method: 'GET', headers })
		const data = await handleCKANResponse<CkanPing>(res)
		success = data.success
	} catch (_err) {
		console.log(_err)
	}
	if (!success) {
		return error(401, { message: 'Unauthorised', id: 'unauthorised' })
	}
	const backend_url = new URL(`${env.CKAN_URL}/api/3/action/${params.path}`)
	url.searchParams.forEach((value, key) => backend_url.searchParams.set(key, value))
	const res = await fetch(backend_url.toString(), {
		headers,
		method: 'GET'
	})

	const data = await handleCKANResponse(res)

	if (data.success) {
		if (params.path.includes('package')) {
			if (typeof data.result === 'object' && data.result) {
				if ('results' in data.result && Array.isArray(data.result.results)) {
					data.result.results = data.result.results.filter((_res) => {
						if ('private' in _res && _res.private === true) {
							return false
						}
						return true
					})
					if ('count' in data.result) {
						// @ts-expect-error ts fix yourself
						data.result.count = data.result.results.length
					}
				}
				if ('private' in data.result && data.result.private === true) {
					data.result = null
				}
			}
		}
	}

	return json(data)
}
