import type { ArkFormErrors } from '$lib/db/validation'

type UnauthorisedError = { reason: 'Unauthorised' }
type UnauthenticatedError = { reason: 'Unauthenticated' }
type MissingIdError = { reason: 'Missing ID' }
type InvalidDataError = {
	reason: 'Invalid Data'
	message?: string
	id?: string
	errors?: ArkFormErrors
}
type NotFoundError = { reason: 'Not Found' }
type UnexpectedError = { reason: 'Unexpected'; error?: unknown }

export type ErrTypes =
	| UnauthorisedError
	| UnauthenticatedError
	| InvalidDataError
	| NotFoundError
	| UnexpectedError
	| MissingIdError

export type Result<T, E extends ErrTypes> = [E, null] | [null, T]

export const ok: <T>(data: T) => Result<T, never> = (x) => [null, x]
export const err: <T extends ErrTypes>(err: T) => Result<never, T> = (x) => [x, null]
