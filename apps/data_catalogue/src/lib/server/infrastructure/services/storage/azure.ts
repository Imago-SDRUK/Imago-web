import type { IStorageService } from '$lib/server/application/services/storage'
import { env } from '$env/dynamic/private'
import { err, ok } from '$lib/server/entities/errors'
import { createSASReadString } from '$lib/utils/files/azure'
import {
	BlobSASPermissions,
	BlobServiceClient,
	newPipeline,
	StorageSharedKeyCredential
} from '@azure/storage-blob'

export const loadStorageClient = ({
	account_name,
	account_key,
	container
}: {
	account_name: string
	account_key: string
	container: string
}): { client: BlobServiceClient; container_name: string } => {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		account_name,
		account_key
		// env.STORAGE_AZURE_ACCOUNT_NAME,
		// env.STORAGE_AZURE_ACCOUNT_KEY
	)
	const pipeline = newPipeline(sharedKeyCredential)
	return {
		client: new BlobServiceClient(
			`https://${account_name}.blob.core.windows.net`,
			// `https://${env.STORAGE_AZURE_ACCOUNT_NAME}.blob.core.windows.net`,
			pipeline
		),
		container_name: container
		// container_name: env.STORAGE_AZURE_CONTAINER
	}
}

export const getUploadUrl: IStorageService['getUploadUrl'] = async ({ filename, credentials }) => {
	try {
		// NOTE: refactor once changes are implemented
		const account_name = credentials.account_name ?? env.STORAGE_AZURE_ACCOUNT_NAME
		const account_key = credentials.account_key ?? env.STORAGE_AZURE_ACCOUNT_KEY
		const container = credentials.container ?? env.STORAGE_AZURE_CONTAINER
		if (!account_name || !account_key || !container) {
			return err({
				reason: 'Invalid Data',
				message: 'invalid storage credentials',
				id: 'invalid-storage-credentials'
			})
		}
		const client = loadStorageClient({ account_name, account_key, container })
		const duration = 5
		const container_name = client.container_name
		const permissions = new BlobSASPermissions()
		permissions.write = true

		const now = new Date()
		const expiry_datetime = new Date(now.setMinutes(now.getMinutes() + duration))
		const blob_sas = {
			containerName: container_name,
			permissions,
			expiresOn: expiry_datetime
		}
		const container_client = client.client.getContainerClient(container_name)
		const blob_client = container_client.getBlockBlobClient(filename)
		const result = await blob_client.generateSasUrl(blob_sas)
		return ok(result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const getDownloadUrl: IStorageService['getDownloadUrl'] = async ({
	filename,
	credentials
}) => {
	try {
		// NOTE: refactor once changes are implemented
		const account_name = credentials.account_name ?? env.STORAGE_AZURE_ACCOUNT_NAME
		const account_key = credentials.account_key ?? env.STORAGE_AZURE_ACCOUNT_KEY
		const container = credentials.container ?? env.STORAGE_AZURE_CONTAINER
		if (!account_name || !account_key || !container) {
			return err({
				reason: 'Invalid Data',
				message: 'invalid storage credentials',
				id: 'invalid-storage-credentials'
			})
		}
		const client = loadStorageClient({ account_name, account_key, container })
		const container_name = client.container_name
		const container_client = client.client.getContainerClient(container_name)
		const blob_client = container_client.getBlockBlobClient(filename)
		return ok(
			blob_client.url + '?' + createSASReadString({ client: client.client, container_name })
		)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const deleteFile: IStorageService['deleteFile'] = async ({ filename, credentials }) => {
	try {
		// NOTE: refactor once changes are implemented
		const account_name = credentials.account_name ?? env.STORAGE_AZURE_ACCOUNT_NAME
		const account_key = credentials.account_key ?? env.STORAGE_AZURE_ACCOUNT_KEY
		const container = credentials.container ?? env.STORAGE_AZURE_CONTAINER
		if (!account_name || !account_key || !container) {
			return err({
				reason: 'Invalid Data',
				message: 'invalid storage credentials',
				id: 'invalid-storage-credentials'
			})
		}
		const client = loadStorageClient({ account_name, account_key, container })
		const container_client = client.client.getContainerClient(client.container_name)
		const blob_client = container_client.getBlockBlobClient(filename)
		const res = await blob_client.deleteIfExists({ deleteSnapshots: 'include' })
		return ok(res.succeeded)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const azureIStorageServiceInfrastructure: IStorageService = {
	getDownloadUrl,
	getUploadUrl,
	deleteFile
}
