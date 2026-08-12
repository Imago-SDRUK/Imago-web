import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { DateTime } from 'luxon'
import { users } from './users'
import { type } from 'arktype'

const reuse = () => ({
	created_by: uuid()
		.references(() => users.id, { onDelete: 'no action' })
		.notNull(),
	updated_by: uuid()
		.references(() => users.id, { onDelete: 'no action' })
		.notNull(),
	created_at: timestamp({
		mode: 'date',
		precision: 3,
		withTimezone: true
	})
		.defaultNow()
		.notNull(),
	updated_at: timestamp({
		mode: 'date',
		precision: 3,
		withTimezone: true
	})
		.defaultNow()
		.notNull()
		.$onUpdateFn(() => DateTime.now().toBSON())
})

export const storages = pgTable('storages', {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
	type: text('type', { enum: ['local', 'azure'] }).notNull(),
	credentials: jsonb(),
	...reuse()
})

export type StorageInsert = typeof storages.$inferInsert
export type Storage = typeof storages.$inferSelect

export const StorageLocalCredentialsSchema = type({
	path: 'string > 1'
})

export const StorageAzureredentialsSchema = type({
	account_name: 'string > 1',
	account_key: 'string > 1',
	container: 'string > 1',
	'path?': 'string'
})
