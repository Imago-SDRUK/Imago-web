import { db } from '$lib/db'
import { downloads, resources } from '$lib/db/schema'
import type { IDownloadsRepository } from '$lib/server/application/repositories/downloads'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import { and, count, eq, gte, lte, sql, desc } from 'drizzle-orm'

const getDownloads: IDownloadsRepository['getDownloads'] = async ({ id }) => {
	try {
		const download = await db.select().from(downloads).where(eq(downloads.resource, id))
		return ok(download)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getDownloadsCount: IDownloadsRepository['getDownloadsCount'] = async ({ id }) => {
	try {
		const download = await db
			.select({ value: count() })
			.from(downloads)
			.where(eq(downloads.resource, id))
		return ok(download[0].value)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const registerDownload: IDownloadsRepository['registerDownload'] = async ({ data }) => {
	try {
		const download = await db.insert(downloads).values(data).returning()
		return ok(download[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getDownloadsAggregate: IDownloadsRepository['getDownloadsAggregate'] = async ({
	from,
	to
}) => {
	try {
		const download = await db
			.select({
				resource_id: downloads.resource,
				count: sql<number>`cast(count(${downloads.resource}) as int)`
			})
			.from(downloads)
			.groupBy(downloads.resource)
			.where(and(gte(downloads.created_at, from), lte(downloads.created_at, to)))
		return ok(download)
	} catch (_err) {
		console.log(_err)
		return err({ reason: 'Unexpected', error: _err })
	}
}


const getTotalDownloads: IDownloadsRepository['getTotalDownloads'] = async () => {
	try {
		const result = await db
			.select({
				count: count()
			})
			.from(downloads)

		return ok(result[0].count)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getTopDownloadedResources: IDownloadsRepository['getTopDownloadedResources'] =
	async () => {
		try {
			const result = await db
				.select({
					resource_title: resources.title,
					download_count: count()
				})
				.from(downloads)
				.innerJoin(
				  resources,
					eq(
						resources.id,
						downloads.resource
					)
				)
				.groupBy(downloads.resource, resources.title)
				.orderBy(desc(count()))
				.limit(3)

			return ok(result)
		} catch (_err) {
			return err({ reason: 'Unexpected', error: _err })
		}
	}

export const downloadsRepositoryInfrastructureDrizzle: IDownloadsRepository = {
	getDownloads,
	getDownloadsCount,
	registerDownload,
	getDownloadsAggregate,
	getTotalDownloads,
	getTopDownloadedResources
}
