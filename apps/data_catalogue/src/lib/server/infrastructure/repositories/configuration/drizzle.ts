import { db } from '$lib/db'
import type { IConfigurationRepository } from '$lib/server/application/repositories/configuration'
import { err, ok } from '$lib/server/entities/errors'
import { configuration } from '$lib/server/entities/models/configuration'
import { eq, sql } from 'drizzle-orm'
const initialiseConfiguration: IConfigurationRepository['initialiseConfiguration'] = async ({
	config
}) => {
	try {
		const _config = await db.insert(configuration).values(config).returning()
		if (_config[0]) {
			return ok(_config[0])
		}
		return err({ reason: 'Not Found', message: 'Configuration not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const addSuperUser: IConfigurationRepository['addSuperUser'] = async ({ id, config_id }) => {
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
		return err({ reason: 'Not Found', message: 'superuser not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const removeSuperUser: IConfigurationRepository['removeSuperUser'] = async ({ id, config_id }) => {
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
		return err({ reason: 'Not Found', message: 'Configuration not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const setAdminGroup: IConfigurationRepository['setAdminGroup'] = async ({ id, config_id }) => {
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
		return err({ reason: 'Not Found', message: 'Configuration not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getConfiguration: IConfigurationRepository['getConfiguration'] = async ({ id }) => {
	try {
		const config = await db.select().from(configuration).where(eq(configuration.id, id))
		if (config[0]) {
			return ok(config[0])
		}
		return err({ reason: 'Not Found', message: 'Configuration not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateConfiguration: IConfigurationRepository['updateConfiguration'] = async ({
	data,
	id
}) => {
	try {
		const config = await db
			.update(configuration)
			.set(data)
			.where(eq(configuration.id, id))
			.returning()
		if (config[0]) {
			return ok(config[0])
		}
		return err({ reason: 'Not Found', message: 'Configuration not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const configurationRepositoryInfrastructureDrizzle: IConfigurationRepository = {
	addSuperUser,
	removeSuperUser,
	setAdminGroup,
	initialiseConfiguration,
	getConfiguration,
	updateConfiguration
}
