import { db } from '$lib/db'
import type { ConfigurationRepository } from '$lib/server/application/repositories/configuration'
import { err, ok } from '$lib/server/entities/errors'
import { configuration } from '$lib/server/entities/models/configuration'
import { eq, sql } from 'drizzle-orm'
const initialiseConfiguration: ConfigurationRepository['initialiseConfiguration'] = async ({
	config
}) => {
	try {
		const _config = await db.insert(configuration).values(config).returning()
		if (_config[0]) {
			return ok(_config[0])
		}
		return err({ reason: 'Not Found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', errors: _err })
	}
}
const addSuperUser: ConfigurationRepository['addSuperUser'] = async ({ id, config_id }) => {
	try {
		const config = await db
			.update(configuration)
			.set({
				superusers: sql`
          CASE 
            WHEN ${id} = ANY(${configuration.superusers}) THEN ${configuration.superusers} 
            ELSE array_cat(${configuration.superusers}, ARRAY[${id}]::uuid[])
          END`
			})
			.where(eq(configuration.id, config_id))
			.returning()
		if (config[0]) {
			return ok(config[0])
		}
		return err({ reason: 'Not Found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', errors: _err })
	}
}

const removeSuperUser: ConfigurationRepository['removeSuperUser'] = async ({ id, config_id }) => {
	try {
		const config = await db
			.update(configuration)

			.set({
				superusers: sql`array_remove(${configuration.superusers}, ${id})`
			})
			.where(eq(configuration.id, config_id))
			.returning()
		if (config[0]) {
			return ok(config[0])
		}
		return err({ reason: 'Not Found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', errors: _err })
	}
}

const setAdminGroup: ConfigurationRepository['setAdminGroup'] = async ({ id, config_id }) => {
	try {
		const config = await db
			.update(configuration)
			.set({
				admin_group: id
			})
			.where(eq(configuration.id, config_id))
			.returning()
		if (config[0]) {
			return ok(config[0])
		}
		return err({ reason: 'Not Found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', errors: _err })
	}
}

const getConfiguration: ConfigurationRepository['getConfiguration'] = async ({ id }) => {
	try {
		const config = await db.select().from(configuration).where(eq(configuration.id, id))
		if (config[0]) {
			return ok(config[0])
		}
		return err({ reason: 'Not Found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', errors: _err })
	}
}

export const configurationRepositoryInfrastructureDrizzle: ConfigurationRepository = {
	addSuperUser,
	removeSuperUser,
	setAdminGroup,
	initialiseConfiguration,
	getConfiguration
}
