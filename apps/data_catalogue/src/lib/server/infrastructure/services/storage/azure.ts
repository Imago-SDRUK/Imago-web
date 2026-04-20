import { env } from '$env/dynamic/private'
import type { StorageService } from '$lib/server/application/services/storage'
import { createSASReadString } from '$lib/utils/files/azure'
import {
	BlobSASPermissions,
	BlobServiceClient,
	newPipeline,
	StorageSharedKeyCredential
} from '@azure/storage-blob'

export const loadStorageClient = (): { client: BlobServiceClient; container_name: string } => {
	const sharedKeyCredential = new StorageSharedKeyCredential(
		env.STORAGE_AZURE_ACCOUNT_NAME,
		env.STORAGE_AZURE_ACCOUNT_KEY
	)
	const pipeline = newPipeline(sharedKeyCredential)
	return {
		client: new BlobServiceClient(
			`https://${env.STORAGE_AZURE_ACCOUNT_NAME}.blob.core.windows.net`,
			pipeline
		),
		container_name: env.STORAGE_AZURE_CONTAINER
	}
}

export const getUploadUrl: StorageService['getUploadUrl'] = async ({ filename }) => {
	const client = loadStorageClient()
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
	return result
}

export const getDownloadUrl: StorageService['getDownloadUrl'] = async ({
	filename
}: {
	filename: string
}) => {
	const client = loadStorageClient()
	const container_name = client.container_name
	const container_client = client.client.getContainerClient(container_name)
	const blob_client = container_client.getBlockBlobClient(filename)
	return blob_client.url + '?' + createSASReadString({ client: client.client, container_name })
}

export const deleteFile = async ({ filename }: { filename: string }) => {
	const client = loadStorageClient()
	const container_client = client.client.getContainerClient(client.container_name)
	const blob_client = container_client.getBlockBlobClient(filename)
	const res = await blob_client.deleteIfExists({ deleteSnapshots: 'include' })
	return res.succeeded
}

export const azureStorageServiceInfrastructure: StorageService = {
	getDownloadUrl,
	getUploadUrl,
	deleteFile
}
