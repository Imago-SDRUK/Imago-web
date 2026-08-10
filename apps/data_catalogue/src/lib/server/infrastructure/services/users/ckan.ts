import { env } from '$env/dynamic/private'
import { create, createCkanClient, get, patch, remove } from '$lib/utils/ckan/ckan'
import { err, ok } from '$lib/server/entities/errors'
import { handleCkanError } from '$lib/server/infrastructure/utils/services/ckan'
import type { IUsersService } from '$lib/server/application/services/users'

const ckan = createCkanClient({
	url: env.CKAN_URL,
	token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
})
const getUser: IUsersService['getUser'] = async ({ id }) => {
	try {
		const res = await ckan.request(
			get('user_show', {
				id
			})
		)
		if (!res.success) {
			return err(handleCkanError(res, 'getUser'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const getUsers: IUsersService['getUsers'] = async () => {
	try {
		const res = await ckan.request(
			get('user_list', {
				all_fields: true
			})
		)
		if (!res.success) {
			return err(handleCkanError(res, 'getUsers'))
		}
		return ok({ items: res.result, limit: 0, offset: 0, total: res.result.length })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const getUserApiKeys: IUsersService['getUserApiKeys'] = async ({ id }) => {
	try {
		const res = await ckan.request(
			get('api_token_list', {
				user_id: id
			})
		)
		if (!res.success) {
			return err(handleCkanError(res, 'getGroup'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const createApiKey: IUsersService['createApiKey'] = async ({ id, name }) => {
	try {
		const res = await ckan.request(
			create('api_token_create', {
				name,
				user: id
			})
		)
		if (!res.success) {
			return err(handleCkanError(res, 'getGroup'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const deleteApiKey: IUsersService['deleteApiKey'] = async ({ id }) => {
	try {
		const res = await ckan.request(
			remove('api_token_revoke', {
				jti: id
			})
		)
		if (!res.success) {
			return err(handleCkanError(res, 'getGroup'))
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const infrastructureServiceUsersCkan: IUsersService = {
	getUser,
	getUsers,
	getUserApiKeys,
	createApiKey,
	deleteApiKey
}
