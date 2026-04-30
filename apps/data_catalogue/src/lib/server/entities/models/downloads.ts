import { pgTable, uuid, timestamp, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { resource_versions, resources } from './resources'

export const downloads = pgTable(
	'downloads',
	{
		resource: uuid()
			.notNull()
			.references(() => resources.id, { onDelete: 'cascade' }),
		version: uuid().references(() => resource_versions.id, { onDelete: 'set null' }),
		user: uuid()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		created_at: timestamp({
			mode: 'date',
			precision: 3,
			withTimezone: true
		})
			.defaultNow()
			.notNull()
	},
	(table) => [index('user_resource_download_idx').on(table.user, table.resource)]
)

export const downloads_relations = relations(downloads, ({ one }) => ({
	resource: one(resources, {
		fields: [downloads.resource],
		references: [resources.id]
	}),

	version: one(resource_versions, {
		fields: [downloads.version],
		references: [resource_versions.id]
	}),

	user: one(users, {
		fields: [downloads.user],
		references: [users.id]
	})
}))

export type Download = typeof downloads.$inferSelect
export type DownloadRequest = typeof downloads.$inferInsert
