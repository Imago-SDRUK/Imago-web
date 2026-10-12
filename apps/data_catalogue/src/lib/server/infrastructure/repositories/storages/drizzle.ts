import type { IStoragesRepository } from '$lib/server/application/repositories/storages'
import { err, ok } from '$lib/server/entities/errors'
import { eq, inArray } from 'drizzle-orm'
import { db } from '$lib/db'
import { storages } from '$lib/db/schema'

const createStorage: IStoragesRepository['createStorage'] = async ({ data, tx }) => {
	try {
		const _db = tx ?? db
		const storage = await _db.insert(storages).values(data).returning()
		if (storage.length === 1) {
			return ok(storage[0])
		}
		return err({ reason: 'Not Found', message: 'Storage not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const deleteStorage: IStoragesRepository['deleteStorage'] = async ({ id, tx }) => {
	try {
		const _db = tx ?? db
		await _db.delete(storages).where(eq(storages.id, id))
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getStorage: IStoragesRepository['getStorage'] = async ({ id, tx }) => {
	try {
		const _db = tx ?? db
		const storage = await _db.select().from(storages).where(eq(storages.id, id))
		if (storage.length === 1) {
			return ok(storage[0])
		}
		return err({ reason: 'Not Found', message: 'Storage not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const listStorages: IStoragesRepository['listStorages'] = async ({ tx, limit, offset, ids }) => {
	try {
		const _db = tx ?? db
		// TODO: add pagination
		const results = await _db
			.select()
			.from(storages)
			.where(ids ? inArray(storages.id, ids) : undefined)
		return ok({ limit, offset, items: results, total: results.length })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateStorage: IStoragesRepository['updateStorage'] = async ({ tx, id, data }) => {
	try {
		const _db = tx ?? db
		const storage = await _db.update(storages).set(data).where(eq(storages.id, id)).returning()
		if (storage.length === 1) {
			return ok(storage[0])
		}
		return err({ reason: 'Not Found', message: 'Storage not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const drizzleIStoragesRepositoryInfrastructure: IStoragesRepository = {
	createStorage,
	deleteStorage,
	getStorage,
	listStorages,
	updateStorage
}
