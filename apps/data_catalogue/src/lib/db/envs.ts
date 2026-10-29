import { type } from 'arktype'
// import { log } from '$lib/utils/server/logger.js'
import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'

expand(dotenv.config({ quiet: true }))

const Env = type({
	NODE_ENV: 'string',
	DB_HOST: 'string',
	DB_USER: 'string',
	DB_PASSWORD: 'string',
	DB_NAME: 'string',
	DB_PORT: 'string.integer.parse',
	DB_SSL: 'string | boolean',
	DATABASE_URL: 'string',
	DB_MIGRATING: 'string | boolean',
	DB_SEEDING: 'string | boolean'
})

function getEnvs() {
	const validated = Env(process.env)

	if (validated instanceof type.errors) {
		if (!process.env.BUILDING) {
			// log.debug(process.env)
			throw Error(validated.summary)
		}
		return null
	} else {
		return validated
	}
}

export const env = getEnvs()
