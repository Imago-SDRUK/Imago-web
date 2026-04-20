import type { UsersRepository } from '$lib/server/application/repositories/users'
import { db } from '$lib/db'
import { users, type UserRequest } from '$lib/server/entities/models/users'
import { log } from '$lib/utils/server/logger'
import { and, count, eq, inArray, sql } from 'drizzle-orm'
import { users_groups } from '$lib/db/schema'
import { err, ok } from '$lib/server/entities/errors'

const createUser: UsersRepository['createUser'] = async ({ data }: { data: UserRequest }) => {
	try {
		const user = await db.insert(users).values(data).returning()
		log.info(`Create user ${user[0].id}`)
		return ok(user[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getUser: UsersRepository['getUser'] = async ({ id }) => {
	try {
		const user = await db.select().from(users).where(eq(users.id, id))
		if (user[0]) {
			return ok(user[0])
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getUsers: UsersRepository['getUsers'] = async ({ limit, offset }) => {
	try {
		const items = await db.select().from(users).limit(limit).offset(offset)
		const total = await db.select({ value: count() }).from(users)
		return ok({ items, limit, offset, total: total[0].value })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getUsersById: UsersRepository['getUsersById'] = async ({ limit, offset, ids }) => {
	try {
		const items = await db
			.select()
			.from(users)
			.where(inArray(users.id, ids))
			.limit(limit)
			.offset(offset)
		const total = await db.select({ value: count() }).from(users)
		return ok({ items, limit, offset, total: total[0].value })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateUser: UsersRepository['updateUser'] = async ({ data, id }) => {
	try {
		const user = await db
			.update(users)
			.set({
				...data,
				...(data.groups ? { groups: sql`array_cat(${users.groups}, ${data.groups})` } : {})
			})
			.where(eq(users.id, id))
			.returning()
		if (user[0]) {
			return ok(user[0])
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getUserGroups: UsersRepository['getUserGroups'] = async ({ id }) => {
	try {
		const user = await db.select().from(users_groups).where(eq(users_groups.user_id, id))
		return ok(user)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const addUserToGroup: UsersRepository['addUserToGroup'] = async ({ data }) => {
	try {
		const result = await db.insert(users_groups).values(data).returning()
		if (result[0]) {
			return ok(result[0])
		}
		return err({ reason: 'Unexpected' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const removeUserGroup: UsersRepository['removeUserGroup'] = async ({ data }) => {
	try {
		const result = await db
			.delete(users_groups)
			.where(and(eq(users_groups.user_id, data.user_id), eq(users_groups.group_id, data.group_id)))
			.returning()
		if (result[0]) {
			return ok(result[0])
		}
		return err({ reason: 'Unexpected' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const userRepositoryInfrastructureDrizzle: UsersRepository = {
	createUser,
	getUser,
	getUsers,
	updateUser,
	getUserGroups,
	addUserToGroup,
	removeUserGroup,
	getUsersById
}
