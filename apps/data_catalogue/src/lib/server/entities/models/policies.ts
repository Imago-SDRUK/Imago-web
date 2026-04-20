import type { Dataset, Resource } from '$lib/server/entities/models/datasets'
import type { PermissionRequest } from '$lib/server/entities/models/permissions'
import type { Answer } from '$lib/server/entities/models/questions'

export const getDatasetBasePermissions = ({
	object,
	owner,
	group
}: {
	object: Dataset
	owner?: string
	group?: string
}): PermissionRequest[] => {
	const namespace = 'Dataset'
	const base: PermissionRequest[] = [
		{
			namespace,
			object: object.id,
			relation: 'admins',
			actor: {
				namespace: 'Group',
				object: 'admin',
				relation: 'users'
			}
		},
		{
			namespace,
			object: object.id,
			relation: 'editors',
			actor: {
				namespace: 'Group',
				object: 'editor',
				relation: 'users'
			}
		},
		{
			namespace,
			object: object.id,
			relation: 'viewers',
			actor: {
				namespace: 'Group',
				object: 'viewer',
				relation: 'users'
			}
		}
	]
	if (group) {
		base.push({
			namespace,
			object: object.id,
			relation: 'viewers',
			actor: {
				namespace: 'Group',
				object: group,
				relation: 'users'
			}
		})
	}
	if (owner) {
		return [
			...base,
			{
				namespace,
				object: object.id,
				relation: 'owners',
				actor: owner
			}
		]
	}
	return base
}

export const getResourceBasePermissions = ({
	object,
	dataset_id
}: {
	object: Resource
	dataset_id: string
}): PermissionRequest[] => {
	const namespace = 'Resource'
	const base: PermissionRequest[] = [
		{
			namespace,
			object: object.id,
			relation: 'datasets',
			actor: {
				namespace: 'Dataset',
				object: dataset_id,
				relation: 'admins'
			}
		},
		{
			namespace,
			object: object.id,
			relation: 'datasets',
			actor: {
				namespace: 'Dataset',
				object: dataset_id,
				relation: 'editors'
			}
		},
		{
			namespace,
			object: object.id,
			relation: 'datasets',
			actor: {
				namespace: 'Dataset',
				object: dataset_id,
				relation: 'viewers'
			}
		}
	]

	return base
}

export const getUserBasePermissions = ({ id }: { id: string }): PermissionRequest[] => {
	return [
		{
			namespace: 'User',
			object: id,
			relation: 'members',
			actor: id
		},
		{
			namespace: 'Group',
			object: 'viewer',
			relation: 'users',
			actor: id
		}
	]
}

export const getAnswerBasePermissions = ({
	user_id,
	answer
}: {
	user_id: string
	answer: Answer
}): PermissionRequest[] => {
	const namespace = 'Answer'
	return [
		{
			namespace,
			object: answer.id,
			relation: 'admins',
			actor: {
				namespace: 'Group',
				object: 'admin',
				relation: 'users'
			}
		},
		{
			namespace,
			object: answer.id,
			relation: 'editors',
			actor: {
				namespace: 'Group',
				object: 'editor',
				relation: 'users'
			}
		},
		{
			namespace,
			object: answer.id,
			relation: 'owners',
			actor: user_id
		}
	]
}

export const getGroupBasePermissions = ({
	object,
	owner
}: {
	object: string
	owner: string
}): PermissionRequest[] => {
	const namespace = 'Group'
	return [
		{
			namespace,
			object: object,
			relation: 'users',
			actor: owner
		}
	]
}
