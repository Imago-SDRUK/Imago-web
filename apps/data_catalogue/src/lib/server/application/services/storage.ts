export type StorageService = {
	getUploadUrl: ({ filename }: { filename: string }) => Promise<string>
	getDownloadUrl: ({ filename }: { filename: string }) => Promise<string>
	deleteFile: ({ filename }: { filename: string }) => Promise<boolean>
}
