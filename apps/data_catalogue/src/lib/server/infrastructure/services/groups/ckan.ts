import type { GroupsService } from '$lib/server/application/services/groups'
import { env } from '$env/dynamic/private'
import { create, createCkanClient, get, patch, remove } from '$lib/utils/ckan/ckan'
import { err, ok } from '$lib/server/entities/errors'
import { handleCkanError } from '$lib/server/infrastructure/utils/services/ckan'

const createGroup: GroupsService['createGroup'] = async ({ data }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(create('group_create', data))
		if (!res.success) {
			return err(handleCkanError(res, 'createGroup'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const getGroup: GroupsService['getGroup'] = async ({ id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(
			get('group_show', {
				id
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

const getGroups: GroupsService['getGroups'] = async ({ page_size, offset }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const limit = page_size
		const res = await ckan.request(
			get('group_list', {
				offset,
				limit,
				include_groups: true,
				all_fields: true
			})
		)

		if (!res.success) {
			return err(handleCkanError(res, 'getGroups'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateGroup: GroupsService['updateGroup'] = async ({ data, id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(patch('group_patch', { id: id }, data))

		if (!res.success) {
			return err(handleCkanError(res, 'updateGroup'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deleteGroup: GroupsService['deleteGroup'] = async ({ id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(remove('group_delete', { id }))

		if (!res.success) {
			return err(handleCkanError(res, 'deleteGroup'))
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const infrastructureServiceGroupsCkan: GroupsService = {
	createGroup,
	getGroup,
	getGroups,
	deleteGroup,
	updateGroup
}
