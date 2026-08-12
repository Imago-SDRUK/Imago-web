import { pgTable, uuid, text, check } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { storages } from '$lib/db/schema'

export const configuration = pgTable(
	'configuration',
	{
		id: text().unique().primaryKey().default('config'),
		admin_group: uuid(),
		superusers: uuid().array().default([]),
		downloads_storage: uuid().references(() => storages.id, { onDelete: 'set null' }),
		products_storage: uuid().references(() => storages.id, { onDelete: 'set null' }),
		geographies_storage: uuid().references(() => storages.id, { onDelete: 'set null' }),
		tiles_storage: uuid().references(() => storages.id, { onDelete: 'set null' })
	},
	(table) => [check('one_row_only', sql`${table.id} = 'config'`)]
)

export type Configuration = typeof configuration.$inferSelect
export type ConfigurationRequest = typeof configuration.$inferInsert
