import type { GroupsService } from '$lib/server/application/services/groups'
import { env } from '$env/dynamic/private'
import { create, createCkanClient, get, patch, remove } from '$lib/utils/ckan/ckan'
import { error } from '@sveltejs/kit'
import { err, ok } from '$lib/server/entities/errors'

const createGroup: GroupsService['createGroup'] = async ({ data }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const group = await ckan.request(create('group_create', data))
	if (group.success === false) {
		return err({ reason: 'Unexpected', error: JSON.stringify(group) })
	}
	return ok(group.result)
}
const getGroup: GroupsService['getGroup'] = async ({ id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const data = await ckan.request(
		get('group_show', {
			id
		})
	)
	if (data.success) {
		return ok(data.result)
	}
	return err({ reason: 'Unexpected' })
	// return ok(null)
}

const getGroups: GroupsService['getGroups'] = async ({ page_size, offset }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const limit = page_size
	const data = await ckan.request(
		get('group_list', {
			offset,
			limit,
			include_groups: true,
			all_fields: true
		})
	)
	if (data.success === false) {
		return err({ reason: 'Unexpected', error: data })
	}
	return ok(data.result)
}

const updateGroup: GroupsService['updateGroup'] = async ({ data, id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const group = await ckan.request(patch('group_patch', { id: id }, data))
	if (group.success === false) {
		return err({ reason: 'Unexpected', error: group })
	}
	return ok(group.result)
}

const deleteGroup: GroupsService['deleteGroup'] = async ({ id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const group = await ckan.request(remove('group_delete', { id }))
	if (group.success === false) {
		return err({ reason: 'Unexpected', error: group })
	}
	return ok(null)
}

export const infrastructureServiceGroupsCkan: GroupsService = {
	createGroup,
	getGroup,
	getGroups,
	deleteGroup,
	updateGroup
}
