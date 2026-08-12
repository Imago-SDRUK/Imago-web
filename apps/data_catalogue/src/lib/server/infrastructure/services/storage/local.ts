import type { IStorageService } from '$lib/server/application/services/storage'
import { ok } from '$lib/server/entities/errors'

let mock: string[] = []

export const getUploadUrl: IStorageService['getUploadUrl'] = async () => {
	return ok('/favicon.png')
}

export const getDownloadUrl: IStorageService['getDownloadUrl'] = async ({ filename }) => {
	const result = mock.find((x) => x === filename)
	if (result) {
		return ok(result)
	}
	return ok('')
}

export const deleteFile: IStorageService['deleteFile'] = async ({ filename }) => {
	const index = mock.findIndex((x) => x === filename)
	if (index > 0) {
		mock = [...mock.slice(0, index), ...mock.slice(index + 1)]
	}
	return ok(true)
}

export const localIStorageServiceInfrastructure: IStorageService = {
	getDownloadUrl,
	getUploadUrl,
	deleteFile
}
