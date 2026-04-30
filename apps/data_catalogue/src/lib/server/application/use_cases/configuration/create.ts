import type { ConfigurationRepository } from '$lib/server/application/repositories/configuration'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import type { UsersRepository } from '$lib/server/application/repositories/users'
import type { IdentityService } from '$lib/server/application/services/identity'
import { type } from 'arktype'
import { err, ok } from '$lib/server/entities/errors'
import { configuration } from '$lib/server/entities/models/configuration'
import { type Group, type GroupRequest } from '$lib/server/entities/models/groups'
import { createInsertSchema } from 'drizzle-arktype'
import type { User } from '$lib/server/entities/models/users'

//TODO: add rollback
export const configurationInitialiseUseCase = async ({
	data,
	config_repository,
	groups_repository,
	users_repository,
	identity_service
}: {
	data: {
		identity: { first_name: string; last_name: string; email: string; password: string }
		// group: GroupRequest
	}
	identity_service: IdentityService
	groups_repository: GroupsRepository
	users_repository: UsersRepository
	config_repository: ConfigurationRepository
}) => {
	/**
	 * fetch or create identity
	 **/
	let identity_id: string | null = null
	const identity_result = await identity_service.getIdentities({ identifier: data.identity.email })
	if (identity_result[0] !== null) {
		return err(identity_result[0])
	}
	if (identity_result[1].length > 0) {
		identity_id = identity_result[1][0].id
	}
	if (!identity_id) {
		const identity_result = await identity_service.createSuperUser({
			data: {
				traits: {
					name: { first: data.identity.first_name, last: data.identity.last_name },
					email: data.identity.email
				},
				recovery_addresses: [
					{
						value: data.identity.email,
						via: 'email'
					}
				],
				credentials: {
					password: {
						config: {
							password: data.identity.password
						}
					}
				},
				schema_id: 'default',
				state: 'active',
				verifiable_addresses: [
					{
						status: 'completed',
						value: data.identity.email,
						verified: true,
						via: 'email'
					}
				]
			}
		})

		if (identity_result[0] !== null) {
			return err(identity_result[0])
		}
		identity_id = identity_result[1].id
	}
	/**
	 * fecth or create user
	 **/

	let user: User | null = null
	const [user_errors, user_req] = await users_repository.getUser({ id: identity_id })
	if (user_errors !== null) {
		return err(user_errors)
	}
	user = user_req
	if (user === null) {
		const [user_errors, user_req] = await users_repository.createUser({
			data: { id: identity_id, status: 'active' }
		})
		if (user_errors !== null) {
			return err(user_errors)
		}
		if (user_req === null) {
			return err({ reason: 'Not Found', message: 'Error creating user' })
		}
		user = user_req
	}

	/**
	 * fetch or create admin group
	 **/

	// const group_schema = createInsertSchema(groups)
	// const group_validated = group_schema(data.group)
	// if (group_validated instanceof type.errors) {
	// 	return err({ reason: 'Invalid Data', message: group_validated.summary })
	// }
	const group_validated: GroupRequest = {
		created_by: user.id,
		updated_by: user.id,
		slug: 'admin',
		title: 'Admin'
	}
	let group: Group | null = null
	const [group_errors, group_req] = await groups_repository.getGroup({ id: group_validated.slug })

	if (group_errors !== null) {
		return err(group_errors)
	}
	group = group_req
	if (group === null) {
		const [group_errors, group_req] = await groups_repository.createGroup({ data: group_validated })
		if (group_errors !== null) {
			return err(group_errors)
		}
		if (group_req === null) {
			return err({ reason: 'Not Found', message: 'Error creating group' })
		}
		group = group_req
	}
	/**
	 * Fetch or create user to group
	 **/
	const [user_group_errors, users_groups] = await users_repository.getUserGroups({ id: user.id })
	if (user_group_errors !== null) {
		return err(user_group_errors)
	}
	if (users_groups === null || !users_groups.find((ug) => ug.group_id === group.id)) {
		const [user_group_errors] = await users_repository.addUserToGroup({
			data: { user_id: user.id, group_id: group.id, created_by: user.id, updated_by: user.id }
		})
		if (user_group_errors !== null) {
			return err(user_group_errors)
		}
	}

	/**
	 * create config from user and group
	 **/
	const config_schema = createInsertSchema(configuration)
	const config_validated = config_schema({
		id: 'config',
		admin_group: group.id,
		superusers: [user.id]
	})
	if (config_validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: config_validated.summary })
	}
	const [errors, result] = await config_repository.initialiseConfiguration({
		config: config_validated
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(result)
}
