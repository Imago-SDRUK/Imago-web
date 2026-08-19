import type { IStorageService } from '$lib/server/application/services/storage'
import { env } from '$env/dynamic/private'
import { err, ok } from '$lib/server/entities/errors'
import { createSASReadString } from '$lib/utils/files/azure'
import {
	BlobSASPermissions,
	BlobServiceClient,
	ContainerSASPermissions,
	generateBlobSASQueryParameters,
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
}): {
	client: BlobServiceClient
	container_name: string
	credentials: StorageSharedKeyCredential
} => {
	const shared_key_credential = new StorageSharedKeyCredential(
		account_name,
		account_key
		// env.STORAGE_AZURE_ACCOUNT_NAME,
		// env.STORAGE_AZURE_ACCOUNT_KEY
	)
	const pipeline = newPipeline(shared_key_credential)
	return {
		client: new BlobServiceClient(
			`https://${account_name}.blob.core.windows.net`,
			// `https://${env.STORAGE_AZURE_ACCOUNT_NAME}.blob.core.windows.net`,
			pipeline
		),
		container_name: container,
		credentials: shared_key_credential
		// container_name: env.STORAGE_AZURE_CONTAINER
	}
}

function getContainerSasUri({
	client,
	container_name,
	shared_key_credential
}: {
	client: BlobServiceClient
	container_name: string
	shared_key_credential: StorageSharedKeyCredential
}) {
	const sas_options = {
		containerName: container_name,
		permissions: ContainerSASPermissions.parse('c'),
		startsOn: new Date(),
		expiresOn: new Date(new Date().valueOf() + 3600 * 1000)
	}

	// if (stored_policy_name == null) {
	// sas_options.startsOn = new Date()
	// sas_options.
	// } else {
	// 	sas_options.identifier = stored_policy_name
	// }

	const sas_token = generateBlobSASQueryParameters(sas_options, shared_key_credential).toString()
	console.log(`SAS token for blob container is: ${sas_token}`)

	return `${client.url}?${sas_token}`
}

export const getUploadUrl =
	(credentials: Record<string, string>): IStorageService['getUploadUrl'] =>
	async ({ filename }) => {
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

export const getDownloadUrl =
	(credentials: Record<string, string>): IStorageService['getDownloadUrl'] =>
	async ({ filename }) => {
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

export const deleteFile =
	(credentials: Record<string, string>): IStorageService['deleteFile'] =>
	async ({ filename }) => {
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

export const getAuthenticationToken =
	(credentials: Record<string, string>): IStorageService['getAuthenticationToken'] =>
	async () => {
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
			const token = getContainerSasUri({
				...client,
				shared_key_credential: client.credentials
			})
			return ok(token)
		} catch (_err) {
			return err({ reason: 'Unexpected', error: _err })
		}
	}

export const azureIStorageServiceInfrastructure: ({
	credentials
}: {
	credentials: Record<string, string>
}) => IStorageService = ({ credentials }) => ({
	getDownloadUrl: getDownloadUrl(credentials),
	getUploadUrl: getUploadUrl(credentials),
	deleteFile: deleteFile(credentials),
	getAuthenticationToken: getAuthenticationToken(credentials)
})
