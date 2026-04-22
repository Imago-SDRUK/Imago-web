import { pgTable, uuid, text, check } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const configuration = pgTable(
	'configuration',
	{
		id: text().unique().primaryKey().default('config'),
		admin_group: uuid(),
		superusers: uuid().array().default([])
	},
	(table) => [check('one_row_only', sql`${table.id} = 'config'`)]
)

export type Configuration = typeof configuration.$inferSelect
export type ConfigurationRequest = typeof configuration.$inferInsert
