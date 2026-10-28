import type { ErrTypes } from '$lib/server/entities/errors'
import type { Download, DownloadRequest } from '$lib/server/entities/models/downloads'

export type IDownloadsRepository = {
	getDownloads: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, Download[]]>
	getDownloadsCount: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, number]>
	getDownloadsAggregate: ({
		from,
		to
	}: {
		from: Date
		to: Date
	}) => Promise<[ErrTypes, null] | [null, { resource_id: string; count: number }[]]>
	registerDownload: ({
		data
	}: {
		data: DownloadRequest
	}) => Promise<[ErrTypes, null] | [null, Download]>

	// Insights Dashboard
	getTotalDownloads: () => Promise<[ErrTypes, null] | [null, number]>

	getTopDownloadedResources: () => Promise<
		[ErrTypes, null] | [null, { resource_title: string; download_count: number }[]]
	>
}
