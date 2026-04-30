import { integer, pgTable, uuid, text, index, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { DateTime } from 'luxon'
import { users } from './users'
import { type } from 'arktype'

const status_enum = pgEnum('status_enum', ['published', 'archived', 'draft'])
const reuse = () => ({
	created_by: uuid()
		.references(() => users.id, { onDelete: 'no action' })
		.notNull(),
	updated_by: uuid()
		.references(() => users.id, { onDelete: 'no action' })
		.notNull(),
	status: status_enum().default('draft').notNull(),
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

export const resources = pgTable(
	'resources',
	{
		id: uuid().primaryKey().defaultRandom(),
		title: text().notNull(),
		description: text(),
		...reuse()
	},
	(table) => [
		index('resource_published_idx')
			.on(table.status)
			.where(sql`${table.status} = 'published'`)
	]
)

export const resource_versions = pgTable('resource_versions', {
	id: uuid().primaryKey().defaultRandom(),
	version: text().notNull(),
	changelog: text(),
	url: text(),
	downloads: integer().default(0).notNull(),
	resource: uuid()
		.notNull()
		.references(() => resources.id, { onDelete: 'cascade' }),
	...reuse()
})

export const resources_resource_versions = relations(resources, ({ many }) => ({
	versions: many(resource_versions)
}))

export const resource_versions_resources = relations(resource_versions, ({ one }) => ({
	resource: one(resources, {
		fields: [resource_versions.resource],
		references: [resources.id]
	})
}))

export type ResourceRequest = typeof resources.$inferInsert
export type Resource = typeof resources.$inferSelect

export type ResourceVersionRequest = typeof resource_versions.$inferInsert
export type ResourceVersion = typeof resource_versions.$inferSelect

//
// export type ResourceServiceRequest = {
// 	/**
// 	 * id of package that the resource should be added to
// 	 **/
// 	package_id: string
// 	/**
// 	 * url of resource
// 	 **/
// 	url: string
// 	description?: string
// 	format?: string
// 	hash?: string
// 	name?: string
// 	resource_type?: string
// 	mimetype?: string
// 	mimetype_inner?: string
// 	cache_url?: string
// 	size?: number
// 	/**
// 	 * iso date string
// 	 **/
// 	created?: string
// 	/**
// 	 *  iso date string
// 	 **/
// 	last_modified?: string
// 	/**
// 	 *  iso date string
// 	 **/
// 	cache_last_updated?: string
// 	/**
// 	 * FieldStorage (needs multipart/form-data)
// 	 **/
// 	upload?: unknown
// }

export const ResourceServiceRequestSchema = type({
	'id?': 'string',
	package_id: 'string',
	name: 'string',
	'last_modified?': 'string | null',
	'metadata_modified?': 'string',
	'mimetype?': 'string | null',
	'mimetype_inner?': 'string | null',
	'position?': 'number',
	'resource_type?': 'string | null',
	'size?': 'string | null',
	'state?': 'string | null',
	'url?': 'string | null',
	'url_type?': 'string | null',
	'cache_last_updated?': 'string | null',
	'cache_url?': 'string | null',
	'created?': 'string | null',
	'datastore_active?': 'boolean',
	'description?': 'string',
	'format?': 'string',
	'hash?': 'string'
})

export const ResourceServiceSchema = type({
	id: 'string',
	package_id: 'string',
	name: 'string',
	position: 'number',
	metadata_modified: 'string',
	state: 'string | null',
	url_type: 'string | null',
	created: 'string | null',
	description: 'string',
	format: 'string',
	'last_modified?': 'string | null',
	'mimetype?': 'string | null',
	'mimetype_inner?': 'string | null',
	'resource_type?': 'string | null',
	'size?': 'string | null',
	'cache_last_updated?': 'string | null',
	'url?': 'string | null',
	'cache_url?': 'string | null',
	'datastore_active?': 'boolean',
	'hash?': 'string'
})

export type ResourceServiceRequest = typeof ResourceServiceRequestSchema.inferIn
export type ResourceServiceDto = typeof ResourceServiceSchema.inferIn
