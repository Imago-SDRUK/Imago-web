import type { ErrTypes } from '$lib/server/entities/errors'
import type {
	Permission,
	PermissionDelete,
	PermissionQuery,
	PermissionRequest,
	Relationship,
	Relationships
} from '$lib/server/entities/models/permissions'

export type AuthorisationService = {
	authorise: ({
		namespace,
		object,
		permits,
		actor,
		action
	}: Permission & {
		action?: () => Promise<void>
	}) => Promise<[ErrTypes, null] | [null, { allowed: boolean }]>

	createPermission: ({
		namespace,
		object,
		relation,
		actor
	}: PermissionRequest) => Promise<[ErrTypes, null] | [null, Relationship]>
	createPermissions: ({
		permissions
	}: {
		permissions: PermissionRequest[]
	}) => Promise<[ErrTypes, null] | [null, null]>
	// updatePermission: () => Promise<void>
	deletePermission: ({
		namespace,
		object,
		relation,
		actor
	}: PermissionDelete) => Promise<[ErrTypes, null] | [null, null]>
	getPermissions: (permision: PermissionQuery) => Promise<[ErrTypes, null] | [null, Relationships]>
}
