import type { ErrTypes } from '$lib/server/entities/errors'

export type IStorageService = {
	getUploadUrl: ({ filename }: { filename: string }) => Promise<[ErrTypes, null] | [null, string]>
	getDownloadUrl: ({ filename }: { filename: string }) => Promise<[ErrTypes, null] | [null, string]>
	deleteFile: ({ filename }: { filename: string }) => Promise<[ErrTypes, null] | [null, boolean]>
	getAuthenticationToken: () => Promise<[ErrTypes, null] | [null, string]>
}
