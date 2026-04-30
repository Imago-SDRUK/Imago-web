import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import { db } from '$lib/db'
import { and, eq, or, sql, inArray } from 'drizzle-orm'
import { groups, users_groups } from '$lib/server/entities/models/groups'
import { users } from '$lib/server/entities/models/users'
import { err, ok } from '$lib/server/entities/errors'
import { validate as validateUUID } from 'uuid'

const getGroup: GroupsRepository['getGroup'] = async ({ id }) => {
	try {
		const valid_uuid = validateUUID(id)
		const group = await db
			.select()
			.from(groups)
			.where(valid_uuid ? eq(groups.id, id) : or(eq(groups.slug, id), eq(groups.title, id)))
		if (group[0]) {
			return ok(group[0])
		}
		return ok(null)
	} catch (_err) {
		if (_err.cause.routine === 'string_to_uuid') {
			return err({ reason: 'Invalid Data', message: `Provide a valid ID`, id: 'invalid' })
		}
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

const getGroups: GroupsRepository['getGroups'] = async ({ limit, offset }) => {
	try {
		const _groups = await db.select().from(groups).limit(limit).offset(offset)
		return ok(_groups)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getGroupsAutoenroll: GroupsRepository['getGroupsAutoenroll'] = async () => {
	try {
		const _groups = await db.select().from(groups).where(eq(groups.autoenroll, true))
		return ok(_groups)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deleteGroup: GroupsRepository['deleteGroup'] = async ({ id }) => {
	try {
		await db.delete(groups).where(eq(groups.id, id))
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const addDatasetToGroup: GroupsRepository['addDatasetToGroup'] = async ({ dataset_id, id }) => {
	try {
		const group = await db
			.update(groups)
			.set({
				datasets: sql`
          CASE 
            WHEN ${dataset_id} = ANY(${groups.datasets}) THEN ${groups.datasets} 
            ELSE array_cat(${groups.datasets}, ARRAY[${dataset_id}]::uuid[])
          END`
			})
			.where(eq(groups.id, id))
			.returning()
		if (group[0]) {
			return ok(group[0])
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const removeDatasetFromGroup: GroupsRepository['removeDatasetFromGroup'] = async ({
	dataset_id,
	id
}) => {
	try {
		const group = await db
			.update(groups)
			.set({
				datasets: sql`array_remove(${groups.datasets}, ${dataset_id})`
			})
			.where(eq(groups.id, id))
			.returning()
		if (group[0]) {
			return ok(group[0])
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const addUserToGroup: GroupsRepository['addUserToGroup'] = async ({ data }) => {
	try {
		const user_group = await db.insert(users_groups).values(data).returning()
		if (user_group[0]) {
			return ok(user_group[0])
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const removeUserFromGroup: GroupsRepository['removeUserFromGroup'] = async ({
	user_id,
	group_id
}) => {
	try {
		await db
			.delete(users_groups)
			.where(and(eq(users_groups.group_id, group_id), eq(users_groups.user_id, user_id)))
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getGroupUsers: GroupsRepository['getGroupUsers'] = async ({ id }) => {
	try {
		const group_users = await db
			.select({ id: users.id })
			.from(users_groups)
			.where(eq(users_groups.group_id, id))
			.innerJoin(users, eq(users_groups.user_id, users.id))
		return ok(group_users)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getGroupsById: GroupsRepository['getGroupsById'] = async ({ ids }) => {
	try {
		const _groups = await db.select().from(groups).where(inArray(groups.id, ids))
		return ok(_groups)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const groupRepositoryInfrastructureDrizzle: GroupsRepository = {
	createGroup,
	getGroup,
	updateGroup,
	getGroups,
	deleteGroup,
	addDatasetToGroup,
	removeDatasetFromGroup,
	addUserToGroup,
	removeUserFromGroup,
	getGroupUsers,
	getGroupsById,
	getGroupsAutoenroll
}
