import { db } from '$lib/db'
import { eq } from 'drizzle-orm'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import { groups } from '$lib/server/entities/models/groups'
import { err, ok } from '$lib/server/entities/errors'

const getGroup: GroupsRepository['getGroup'] = async ({ id }) => {
	try {
		const group = await db.select().from(groups).where(eq(groups.id, id))
		if (group[0]) {
			return ok(group[0])
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const createGroup: GroupsRepository['createGroup'] = async ({ data }) => {
	try {
		const group = await db.insert(groups).values(data).returning()
		if (group[0]) {
			return ok(group[0])
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateGroup: GroupsRepository['updateGroup'] = async ({ data, id }) => {
	try {
		const group = await db.update(groups).set(data).where(eq(groups.id, id)).returning()
		if (group[0]) {
			return ok(group[0])
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getGroups: GroupsRepository['getGroups'] = async () => {
	return ok([])
}

export const groupRepositoryInfrastructureTest: GroupsRepository = {
	createGroup,
	getGroup,
	updateGroup,
	getGroups
}
