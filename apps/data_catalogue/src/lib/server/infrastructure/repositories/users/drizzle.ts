import { insightsDateFilter } from '../insights_date_filter'
import type { IUsersRepository } from '$lib/server/application/repositories/users'
import { db } from '$lib/db'
import { users, type UserRequest } from '$lib/server/entities/models/users'
import { log } from '$lib/utils/server/logger'
import { and, count, countDistinct, desc, eq, inArray, sql } from 'drizzle-orm'
import { answers, downloads, groups, users_groups } from '$lib/db/schema'
import { err, ok } from '$lib/server/entities/errors'

const createUser: IUsersRepository['createUser'] = async ({ data }: { data: UserRequest }) => {
	try {
		const user = await db.insert(users).values(data).returning()
		log.info(`Create user ${user[0].id}`)
		return ok(user[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getUser: IUsersRepository['getUser'] = async ({ id }) => {
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

const getUsers: IUsersRepository['getUsers'] = async ({ limit, offset }) => {
	try {
		const items = await db
			.select()
			.from(users)
			.orderBy(desc(users.created_at))
			.limit(limit)
			.offset(offset)
		const total = await db.select({ value: count() }).from(users)
		return ok({ items, limit, offset, total: total[0].value })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getUsersById: IUsersRepository['getUsersById'] = async ({ limit, offset, ids }) => {
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

const updateUser: IUsersRepository['updateUser'] = async ({ data, id }) => {
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

const getUserGroups: IUsersRepository['getUserGroups'] = async ({ id }) => {
	try {
		const user_groups = await db
			.select({
				group: groups.title,
				group_id: users_groups.group_id,
				user_id: users_groups.user_id
			})
			.from(users_groups)
			.where(eq(users_groups.user_id, id))
			.innerJoin(groups, eq(users_groups.group_id, groups.id))
		return ok(user_groups)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const addUserToGroup: IUsersRepository['addUserToGroup'] = async ({ data }) => {
	try {
		const result = await db.insert(users_groups).values(data).returning()
		if (result[0]) {
			return ok(result[0])
		}
		return err({ reason: 'Unexpected', error: 'not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const removeUserGroup: IUsersRepository['removeUserGroup'] = async ({ data }) => {
	try {
		const result = await db
			.delete(users_groups)
			.where(and(eq(users_groups.user_id, data.user_id), eq(users_groups.group_id, data.group_id)))
			.returning()
		if (result[0]) {
			return ok(result[0])
		}
		return err({ reason: 'Unexpected', error: 'not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getTotalUsers: IUsersRepository['getTotalUsers'] = async (dateRange = {}) => {
	try {
		const result = await db
			.select({ total: count() })
			.from(users)
			.where(insightsDateFilter(users.created_at, dateRange))
		return ok(result[0]?.total ?? 0)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getUsersWithDownloads: IUsersRepository['getUsersWithDownloads'] = async (dateRange = {}) => {
	try {
		const result = await db
			.select({ total: countDistinct(users.id) })
			.from(users)
			.innerJoin(downloads, eq(users.id, downloads.user))
			.where(insightsDateFilter(users.created_at, dateRange))
		return ok(result[0]?.total ?? 0)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getUsersByCountry: IUsersRepository['getUsersByCountry'] = async (dateRange = {}) => {
	try {
		const result = await db
			.select({ country: answers.answer, total: countDistinct(users.id) })
			.from(users)
			.innerJoin(answers, eq(users.id, answers.created_by))
			.where(
				and(
					eq(answers.question_reference, 'Country of organisation'),
					insightsDateFilter(users.created_at, dateRange)
				)
			)
			.groupBy(answers.answer)
			.orderBy(desc(countDistinct(users.id)))
		return ok(result.map((row) => ({ country: row.country ?? '', total: row.total })))
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getUsersByCategory: IUsersRepository['getUsersByCategory'] = async (dateRange = {}) => {
	try {
		const result = await db
			.select({ category: answers.answer, total: countDistinct(users.id) })
			.from(users)
			.innerJoin(answers, eq(users.id, answers.created_by))
			.where(
				and(
					eq(answers.question_reference, 'Which category best describe you?'),
					insightsDateFilter(users.created_at, dateRange)
				)
			)
			.groupBy(answers.answer)
			.orderBy(desc(countDistinct(users.id)))
		return ok(result.map((row) => ({ category: row.category ?? '', total: row.total })))
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const userRepositoryInfrastructureDrizzle: IUsersRepository = {
	getTotalUsers,
	getUsersWithDownloads,
	getUsersByCountry,
	getUsersByCategory,
	createUser,
	getUser,
	getUsers,
	updateUser,
	getUserGroups,
	addUserToGroup,
	removeUserGroup,
	getUsersById
}
