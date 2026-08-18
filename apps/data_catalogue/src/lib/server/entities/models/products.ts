import {
	pgTable,
	uuid,
	timestamp,
	text,
	integer,
	index,
	primaryKey,
	pgEnum,
	jsonb,
	boolean
} from 'drizzle-orm/pg-core'
import { users } from './users'
import { DateTime } from 'luxon'
import { v7 as uuidv7 } from 'uuid'
import { storages } from './storage'
import { type } from 'arktype'

export const product_resources_status_enum = pgEnum('product_resources_status_enum', [
	'completed',
	'error',
	'requested',
	'processing'
])

export const product_requests_status_enum = pgEnum('product_requests_status_enum', [
	'notified',
	'error',
	'requested'
])

export const products = pgTable('products', {
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
		.$onUpdateFn(() => DateTime.now().toBSON()),
	id: uuid()
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	name: text().unique().notNull(),
	versions: text().array().default([]),
	years: integer().array().default([])
})

export const products_product_options = pgTable(
	'products_product_options',
	{
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
			.$onUpdateFn(() => DateTime.now().toBSON()),
		product_id: uuid('product_id')
			.references(() => products.id, {
				onDelete: 'cascade'
			})
			.notNull(),
		product_option_id: uuid('product_option_id')
			.references(() => product_options.id, {
				onDelete: 'cascade'
			})
			.notNull()
	},
	(table) => [
		primaryKey({ columns: [table.product_id, table.product_option_id] }),
		index('products_product_options_product_idx').on(table.product_id),
		index('products_product_options_product_option_idx').on(table.product_option_id)
	]
)

export const product_options = pgTable(
	'product_options',
	{
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
			.$onUpdateFn(() => DateTime.now().toBSON()),
		id: uuid()
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		name: text().unique().notNull(),
		value: text().notNull(),
		group_id: uuid().references(() => product_option_groups.id, { onDelete: 'set null' })
	},
	(table) => [index('product_options_product_option_groups_idx').on(table.group_id)]
)

export const product_option_groups = pgTable('product_option_groups', {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => uuidv7()),
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
		.$onUpdateFn(() => DateTime.now().toBSON()),
	name: text().unique().notNull(),
	value: text().notNull(),
	multiple: boolean().default(false).notNull(),
	required: boolean().default(true).notNull(),
	min_selection: integer().default(1).notNull(),
	max_selection: integer().default(1).notNull()
})

export const product_requests = pgTable(
	'product_requests',
	{
		created_by: uuid()
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		updated_by: uuid()
			.references(() => users.id, { onDelete: 'cascade' })
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
			.$onUpdateFn(() => DateTime.now().toBSON()),
		status: product_requests_status_enum().default('requested').notNull(),
		id: uuid()
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		product_id: uuid()
			.references(() => products.id)
			.notNull(),
		version: text().notNull(),
		year: integer().notNull(),
		options: uuid()
			.array()
			// .references(() => product_options.id, { onDelete: 'no action' })
			.default([])
			.notNull()
	},
	(table) => [index('product_requests_product_id_idx').on(table.product_id)]
)

export const product_resources = pgTable(
	'product_resources',
	{
		created_by: uuid()
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		updated_by: uuid()
			.references(() => users.id, { onDelete: 'cascade' })
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
			.$onUpdateFn(() => DateTime.now().toBSON()),
		status: product_resources_status_enum().default('requested').notNull(),
		id: uuid()
			.primaryKey()
			.$defaultFn(() => uuidv7()),
		product_id: uuid()
			.references(() => products.id)
			.notNull(),
		version: text().notNull(),
		year: integer().notNull(),
		options: uuid()
			.array()
			// .references(() => product_options.id, { onDelete: 'no action' })
			.default([])
			.notNull(),
		path: text(),
		filename: text(),
		metadata: jsonb(),
		messages: jsonb(),
		storage: uuid().references(() => storages.id, { onDelete: 'set null' })
	},
	(table) => [
		index('product_resources_product_id_idx').on(table.product_id),
		index('product_resources_storage_idx').on(table.storage)
	]
)

/**
 * {
 * status: 'error' | 'completed' | 'processing'
 * filename: string,
 * path: string,
 * metadata: ?,
 * messages: {type: 'error' | 'process', message: string}
 * }
 **/

export const ProductResourceUpdateMessageSchema = type({
	status: "'trace' | 'debug' | 'info' | 'warn'| 'error' | 'fatal'",
	message: 'string'
})

export const ProductResourceUpdateCompleteSchema = type({
	status: "'error' | 'completed' | 'processing'",
	filename: 'string',
	path: 'string',
	'metadata?': 'object'
})

export const ProductPipelineSchema = type({
	product: 'string',
	version: 'string',
	year: 'string',
	geography: 'string',
	stats: 'string',
	data_sas: 'string',
	geographies_sas: 'string',
	output_sas: 'string'
})

export const ProductResourceUpdateSchema = type.or(
	ProductResourceUpdateMessageSchema,
	ProductResourceUpdateCompleteSchema
)

export type Product = typeof products.$inferSelect
export type ProductInsert = typeof products.$inferInsert
export type ProductOption = typeof product_options.$inferSelect
export type ProductOptionInsert = typeof product_options.$inferInsert
export type ProductOptionGroup = typeof product_option_groups.$inferSelect
export type ProductOptionGroupInsert = typeof product_option_groups.$inferInsert
export type ProductsProductOptions = typeof products_product_options.$inferSelect
export type ProductsProductOptionsInsert = typeof products_product_options.$inferInsert
export type ProductRequest = typeof product_requests.$inferSelect
export type ProductRequestInsert = typeof product_requests.$inferInsert
export type ProductResource = typeof product_resources.$inferSelect
export type ProductResourceInsert = typeof product_resources.$inferInsert
export type ProductPipeline = typeof ProductPipelineSchema.infer
