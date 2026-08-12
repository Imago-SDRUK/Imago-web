import type { ErrTypes } from '$lib/server/entities/errors'

export type IStorageService = {
	getUploadUrl: ({
		filename
	}: {
		filename: string
		credentials: Record<string, string>
	}) => Promise<[ErrTypes, null] | [null, string]>
	getDownloadUrl: ({
		filename
	}: {
		filename: string
		credentials: Record<string, string>
	}) => Promise<[ErrTypes, null] | [null, string]>
	deleteFile: ({
		filename
	}: {
		filename: string
		credentials: Record<string, string>
	}) => Promise<[ErrTypes, null] | [null, boolean]>
}
