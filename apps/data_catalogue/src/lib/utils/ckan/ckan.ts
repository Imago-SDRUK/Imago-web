import type { CkanJSONResponse, CkanTextError } from './actions'
import type { CkanClient, CkanClientParams } from '.'
import type { CkanGetActions } from '$lib/utils/ckan/actions/read'
import type { CkanCreateActions } from '$lib/utils/ckan/actions/create'
import type { CkanDeleteActions } from '$lib/utils/ckan/actions/delete'
import type { CkanPatchActions, CkanUpdateActions } from '$lib/utils/ckan/actions/update'
import type { CkanPing } from '$lib/types/ckan'
import type { CkanextActivityGetActions } from '$lib/utils/ckan/extensions/versions/read'
export const handleCKANResponse = async <T>(response: Response) => {
	const contentType = response.headers.get('content-type')
	if (contentType && contentType.indexOf('application/json') !== -1) {
		return response
			.json()
			.then((res) =>
				typeof res === 'object' && res ? { ...res, help: undefined } : res
			) as Promise<CkanJSONResponse<T>>
	} else {
		return response.text().then((text) => ({
			message: response.statusText ?? text,
			status: response.status,
			success: false,
			result: []
		})) as Promise<CkanTextError>
	}
}

export const createCkanClient = ({ url, token, fetch }: CkanClientParams): CkanClient => {
	const config = { url, token, fetch }
	return {
		...config,
		async request(data) {
			return data(this)
		},
		async ping() {
			try {
				const url = processURL(config.url, `/api/action/status_show`)
				const headers = new Headers()
				if (token) {
					headers.set('Authorization', token)
				}
				const res = await fetch(url, { method: 'GET', headers })
				const data = await handleCKANResponse<CkanPing>(res)
				return {
					success: data.success
				}
			} catch {
				return {
					success: false
				}
			}
		}
	}
}

const processURL = (url: string | URL, path: string, params?: Record<PropertyKey, unknown>) => {
	const _url = typeof url === 'string' ? new URL(url) : url
	_url.pathname = path
	if (params) {
		Object.entries(params).forEach(([name, value]) => {
			if (value !== '' && value !== null && value !== undefined) {
				_url.searchParams.append(String(name), String(value))
			}
		})
	}
	return _url.toString()
}

type CkanAllGetActions = CkanGetActions | CkanextActivityGetActions
export const get =
	<T extends CkanAllGetActions[0]>(
		action: T,
		query?: Extract<CkanAllGetActions, [T, unknown, unknown]>[1]
	) =>
	async (client: CkanClient) => {
		const url = processURL(client.url, `/api/3/action/${action}`, query)
		const headers = new Headers()
		if (client.token) {
			headers.set('Authorization', client.token)
		}
		const res = await fetch(url, { method: 'GET', headers })
		const data = await handleCKANResponse<Extract<CkanAllGetActions, [T, unknown, unknown]>[2]>(res)
		return data
	}

export const create =
	<T extends CkanCreateActions[0]>(
		action: T,
		body: Extract<CkanCreateActions, [T, unknown, unknown]>[1]
	) =>
	async (client: CkanClient) => {
		const url = processURL(client.url, `/api/3/action/${action}`)

		const headers = new Headers()
		if (client.token) {
			headers.set('Authorization', client.token)
		}
		let _body: FormData | string = ''
		if (body instanceof FormData) {
			headers.set('Content-Type', 'application/x-www-form-urlencoded')
			_body = body
		} else {
			headers.set('Content-Type', 'application/json')
			_body = JSON.stringify(body)
		}
		const res = await fetch(url, { method: 'POST', headers, body: _body })
		const data = await handleCKANResponse<Extract<CkanCreateActions, [T, unknown, unknown]>[2]>(res)
		return data
	}

export const remove =
	<T extends CkanDeleteActions[0]>(action: T, body?: Extract<CkanDeleteActions, [T, unknown]>[1]) =>
	async (client: CkanClient) => {
		const url = processURL(client.url, `/api/3/action/${action}`, body)
		const headers = new Headers()
		if (client.token) {
			headers.set('Authorization', client.token)
		}

		let _body: FormData | string = ''
		if (body instanceof FormData) {
			headers.set('Content-Type', 'application/x-www-form-urlencoded')
			_body = body
		} else {
			headers.set('Content-Type', 'application/json')
			_body = JSON.stringify(body)
		}

		const res = await fetch(url, { method: 'POST', headers, body: _body })
		const data = await handleCKANResponse(res)
		return data
	}

export const patch =
	<T extends CkanPatchActions[0]>(
		action: T,
		query: Extract<CkanPatchActions, [T, unknown, unknown, unknown]>[1],
		body: Extract<CkanPatchActions, [T, unknown, unknown, unknown]>[2] | FormData
	) =>
	async (client: CkanClient) => {
		const url = processURL(client.url, `/api/3/action/${action}`, query)
		const headers = new Headers()
		if (client.token) {
			headers.set('Authorization', client.token)
		}
		let _body: FormData | string = ''
		if (body instanceof FormData) {
			headers.set('Content-Type', 'application/x-www-form-urlencoded')
			_body = body
		} else {
			headers.set('Content-Type', 'application/json')
			_body = JSON.stringify(body)
		}
		const res = await fetch(url, { method: 'POST', headers, body: _body })
		const data =
			await handleCKANResponse<Extract<CkanCreateActions, [T, unknown, unknown, unknown]>[3]>(res)
		return data
	}

export const update =
	<T extends CkanUpdateActions[0]>(
		action: T,
		query: Extract<CkanUpdateActions, [T, unknown]>[1],
		body: Record<PropertyKey, unknown>
	) =>
	async (client: CkanClient) => {
		const url = processURL(client.url, `/api/3/action/${action}`, query)
		const headers = new Headers()
		if (client.token) {
			headers.set('Authorization', client.token)
		}
		let _body: FormData | string = ''
		if (body instanceof FormData) {
			headers.set('Content-Type', 'application/x-www-form-urlencoded')
			_body = body
		} else {
			headers.set('Content-Type', 'application/json')
			_body = JSON.stringify(body)
		}
		const res = await fetch(url, { method: 'PATCH', headers, body: _body })
		const data = await handleCKANResponse(res)
		return data
	}

// export const update =
// 	(...action: CkanUpdateActions) =>
// 	async (client: CkanClient) => {
// 		const url = processURL(client.url, `/api/3/action/${action}`, action[1])
// 		const headers = new Headers()
// 		if (client.token) {
// 			headers.set('Authorization', client.token)
// 		}
// 		const res = await fetch(url, { method: 'PUT', headers })
// 		const data = await handleCKANResponse(res)
// 		return data
// 	}
