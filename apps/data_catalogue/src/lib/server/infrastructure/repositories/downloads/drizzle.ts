import { db } from '$lib/db'
import { downloads } from '$lib/db/schema'
import type { DownloadsRepository } from '$lib/server/application/repositories/downloads'
import { err, ok } from '$lib/server/entities/errors'
import { count, eq } from 'drizzle-orm'

const getDownloads: DownloadsRepository['getDownloads'] = async ({ id }) => {
	try {
		const download = await db.select().from(downloads).where(eq(downloads.resource, id))
		return ok(download)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getDownloadsCount: DownloadsRepository['getDownloadsCount'] = async ({ id }) => {
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

const registerDownload: DownloadsRepository['registerDownload'] = async ({ data }) => {
	try {
		const download = await db.insert(downloads).values(data).returning()
		return ok(download[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const downloadsRepositoryInfrastructureDrizzle: DownloadsRepository = {
	getDownloads,
	getDownloadsCount,
	registerDownload
}
