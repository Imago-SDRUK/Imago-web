import type { StorageService } from '$lib/server/application/services/storage'

export const getUploadUrl: StorageService['getUploadUrl'] = async () => {
	return ''
}

export const getDownloadUrl: StorageService['getDownloadUrl'] = async () => {
	return ''
}

export const deleteFile = async () => {
	return true
}

export const testStorageServiceInfrastructure: StorageService = {
	getDownloadUrl,
	getUploadUrl,
	deleteFile
}
