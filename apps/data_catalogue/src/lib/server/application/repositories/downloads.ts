import type { ErrTypes } from '$lib/server/entities/errors'
import type { Download, DownloadRequest } from '$lib/server/entities/models/downloads'

export type DownloadsRepository = {
	getDownloads: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, Download[]]>
	getDownloadsCount: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, number]>
	registerDownload: ({
		data
	}: {
		data: DownloadRequest
	}) => Promise<[ErrTypes, null] | [null, Download]>
}
