import type { ArkFormErrors } from '$lib/db/validation'

type UnauthorisedError = { reason: 'Unauthorised'; message?: string }
type MissingConfigurationError = { reason: 'Missing Configuration'; message?: string }
type UnauthenticatedError = { reason: 'Unauthenticated' }
type MissingIdError = { reason: 'Missing ID'; message?: string }
type InvalidDataError = {
	reason: 'Invalid Data'
	message: string
	id: string
	errors?: ArkFormErrors
}
type NotFoundError = { reason: 'Not Found'; message: string }
type UnexpectedError = { reason: 'Unexpected'; error: unknown }

export type ErrTypes =
	| UnauthorisedError
	| UnauthenticatedError
	| InvalidDataError
	| NotFoundError
	| UnexpectedError
	| MissingIdError
	| MissingConfigurationError

export type Result<T, E extends ErrTypes> = [E, null] | [null, T]

export const ok: <T>(data: T) => Result<T, never> = (x) => [null, x]
export const err: <T extends ErrTypes>(err: T) => Result<never, T> = (x) => [x, null]
export const errFmt = (err: ErrTypes): [number, App.Error] => {
	if (err.reason === 'Invalid Data') return [400, { message: err.message, id: '' }]
	if (err.reason === 'Unauthorised')
		return [401, { message: err.message ?? `You're not allowed to perform this action.`, id: '' }]
	if (err.reason === 'Unauthenticated')
		return [403, { message: `You need to authenticate.`, id: '' }]
	if (err.reason === 'Missing ID')
		return [422, { message: err.message ?? `You need to provide an ID.`, id: '' }]
	if (err.reason === 'Not Found') return [404, { message: err.message ?? `Not found`, id: '' }]
	if (err.reason === 'Missing Configuration')
		return [
			500,
			{
				message: `There is no configuration enabled to perform this action.`,
				id: 'missing-configuration'
			}
		]
	if (err.reason === 'Unexpected')
		return [500, { message: `This shouldn't have happened, please try again.`, id: '' }]
	return [500, { message: `This shouldn't have happened, please try again.`, id: '' }]
}
