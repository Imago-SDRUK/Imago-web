import { drizzle, NodePgTransaction, type NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import pg, { Client, Pool } from 'pg'
import * as schema from './schema/'
import { env } from './envs'
import type { ExtractTablesWithRelations } from 'drizzle-orm'

const client = new Client({
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	host: env.DB_HOST,
	port: env.DB_PORT,
	ssl: env.DB_SSL && env.DB_SSL === 'true' ? true : false,
	connectionTimeoutMillis: 1000 * 10
})
const pool = new Pool({
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	host: env.DB_HOST,
	port: env.DB_PORT,
	max:
		(env.DB_MIGRATING && env.DB_MIGRATING === 'true') ||
		(env.DB_SEEDING && env.DB_SEEDING === 'true')
			? 1
			: undefined,
	ssl: env.DB_SSL && env.DB_SSL === 'true' ? true : false,
	connectionTimeoutMillis: 1000 * 10
})

// const client = pg.native
// 	? new pg.native.Client({
// 			user: env.DB_USER,
// 			password: env.DB_PASSWORD,
// 			database: env.DB_NAME,
// 			host: env.DB_HOST,
// 			port: env.DB_PORT
// 		})
// 	: new Client({
// 			user: env.DB_USER,
// 			password: env.DB_PASSWORD,
// 			database: env.DB_NAME,
// 			host: env.DB_HOST,
// 			port: env.DB_PORT
// 		})
// const pool = pg.native
// 	? new pg.native.Pool({
// 			user: env.DB_USER,
// 			password: env.DB_PASSWORD,
// 			database: env.DB_NAME,
// 			host: env.DB_HOST,
// 			port: env.DB_PORT
// 		})
// 	: new Pool({
// 			user: env.DB_USER,
// 			password: env.DB_PASSWORD,
// 			database: env.DB_NAME,
// 			host: env.DB_HOST,
// 			port: env.DB_PORT,
// 			max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined
// 		})

export const db = drizzle({
	client: env.DB_MIGRATING && env.DB_MIGRATING === 'true' ? client : pool,
	schema,
	logger: false
})

// export type Transaction = PgTransaction<
// 	PgQueryResultHKT,
// 	Record<string, never>,
// 	ExtractTablesWithRelations<Record<string, never>>
// >

export type Transaction = NodePgTransaction<
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>
