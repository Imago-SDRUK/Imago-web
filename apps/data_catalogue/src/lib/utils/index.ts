import type { LinkPagination } from '$lib/types/ory/kratos'

export function removeKey<T>(obj: T, key: keyof T) {
	const { [key]: _, ...rest } = obj
	return rest
}

export function removeKeys<T>(obj: T, keys: (keyof T)[]) {
	return keys.reduce(
		(acc, key) => {
			const new_obj = removeKey(acc, key)
			return new_obj
		},
		obj as Omit<T, keyof T>
	)
}

export const parseLink = (link: string | null) => {
	if (!link) {
		return {}
	}
	return link
		.split(',')
		.map((link) => link.split('; '))
		.reduce((acc, [url, key]) => {
			const _key = key.split('=')[1]?.replaceAll(`"`, '')
			const _url = url.replaceAll('<', '').replaceAll('>', '')
			const new_url = new URL(`http://127.0.0.1${_url}`)
			if (_key === 'first' || _key === 'next') {
				acc[_key] = {
					// url: _url,
					page_size: new_url.searchParams.get('page_size'),
					page_token: new_url.searchParams.get('page_token')
				}
			}

			return acc
		}, {} as LinkPagination)
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
