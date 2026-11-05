import type { IUsersRepository } from '$lib/server/application/repositories/users'
import { type UserRequest } from '$lib/server/entities/models/users'
import { ok } from '$lib/server/entities/errors'
import { DateTime } from 'luxon'

const createUser: IUsersRepository['createUser'] = async ({ data }: { data: UserRequest }) => {
	return ok({
		...data,
		status: 'draft',
		created_at: DateTime.now().toJSDate(),
		updated_at: DateTime.now().toJSDate(),
		deleted_at: null,
		groups: [],
		id: '',
		preferences: null
	})
}

const getUser: IUsersRepository['getUser'] = async ({ id }) => {
	return ok({
		status: 'draft',
		created_at: DateTime.now().toJSDate(),
		updated_at: DateTime.now().toJSDate(),
		deleted_at: null,
		groups: [],
		id: id,
		preferences: null
	})
}

const getUsers: IUsersRepository['getUsers'] = async () => {
	return ok({ items: [], total: 0, offset: 0, limit: 0 })
}

const getUsersById: IUsersRepository['getUsersById'] = async () => {
	return ok({ items: [], total: 0, offset: 0, limit: 0 })
}

const updateUser: IUsersRepository['updateUser'] = async ({ data, id }) => {
	return ok({
		status: data.status ?? 'draft',
		created_at: data.created_at ?? DateTime.now().toJSDate(),
		updated_at: DateTime.now().toJSDate(),
		deleted_at: data.deleted_at ?? null,
		groups: data.groups ?? [],
		id: id,
		preferences: data.preferences ?? null
	})
}

const getUserGroups: IUsersRepository['getUserGroups'] = async () => {
	return ok([])
}

const addUserToGroup: IUsersRepository['addUserToGroup'] = async ({ data }) => {
	return ok({
		...data,
		created_at: data.created_at ?? DateTime.now().toJSDate(),
		updated_at: DateTime.now().toJSDate(),
		created_by: '',
		updated_by: ''
	})
}

const removeUserGroup: IUsersRepository['removeUserGroup'] = async ({ data }) => {
	return ok({
		...data,
		created_at: DateTime.now().toJSDate(),
		updated_at: DateTime.now().toJSDate(),
		created_by: '',
		updated_by: ''
	})
}

const getTotalUsers: IUsersRepository['getTotalUsers'] = async () => ok(0)
const getUsersWithDownloads: IUsersRepository['getUsersWithDownloads'] = async () => ok(0)
const getUsersByCountry: IUsersRepository['getUsersByCountry'] = async () => ok([])
const getUsersByCategory: IUsersRepository['getUsersByCategory'] = async () => ok([])

export const userRepositoryInfrastructureTest: IUsersRepository = {
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
