import type { PermissionRequest } from '$lib/server/entities/models/permissions'
import type { Answer } from '$lib/server/entities/models/questions'

export const getDatasetBasePermissions = ({
	id,
	owner,
	admin_group
}: {
	id: string
	owner?: string
	admin_group: string | null
}): PermissionRequest[] => {
	const namespace = 'Dataset'
	const base: PermissionRequest[] = []
	if (admin_group) {
		base.push({
			namespace,
			object: id,
			relation: 'admins',
			actor: {
				namespace: 'Group',
				object: admin_group,
				relation: 'members'
			}
		})
	}
	if (owner) {
		base.push({
			namespace,
			object: id,
			relation: 'owners',
			actor: owner
		})
	}
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
			relation: 'members',
			actor: id
		}
	]
}

export const getAnswerBasePermissions = ({
	user_id,
	answer,
	admin_group
}: {
	user_id: string
	answer: Answer
	admin_group: string | null
}): PermissionRequest[] => {
	const namespace = 'Answer'
	return [
		{
			namespace,
			object: answer.id,
			relation: 'members',
			actor: {
				namespace: 'Group',
				object: admin_group ?? 'admin',
				relation: 'members'
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
			relation: 'members',
			actor: owner
		}
	]
}
