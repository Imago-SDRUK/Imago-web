import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import type { CkanError, CkanJSONResponse, CkanTextError } from '$lib/utils/ckan/actions'

export const ckanWrapper = async <T>(fn: () => Promise<CkanTextError | CkanJSONResponse<T>>) => {
	try {
		const res = await fn()
		if (!res.success) {
			return err(handleCkanError(res))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const handleCkanError = (
	obj:
		| ({
				help: string
		  } & CkanError)
		| CkanTextError,
	caller?: string
): ErrTypes => {
	if ('error' in obj) {
		if (obj.error?.__type === 'Not Found Error') {
			const keys = Object.keys(obj.error).filter((key) => key !== '__type' && key !== 'message')
			return { reason: 'Not Found', message: obj.error?.[keys?.[0]]?.[0] ?? caller ?? '' }
		}
		const keys = Object.keys(obj.error).filter((key) => key !== '__type')
		return {
			reason: 'Invalid Data',
			message: `${keys?.[0]}: ${obj.error?.[keys?.[0]]?.[0] ?? ''}`,
			id: caller ?? ''
		}
	}
	if ('message' in obj && 'status' in obj) {
		return {
			reason: 'Invalid Data',
			message: obj.message,
			id: caller ?? ''
		}
	}
	return { reason: 'Unexpected', error: obj }
}
