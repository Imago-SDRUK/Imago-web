import { pgTable, uuid, timestamp, text, integer, index, primaryKey } from 'drizzle-orm/pg-core'
import { users } from './users'
import { DateTime } from 'luxon'
import { v7 as uuidv7 } from 'uuid'

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

export const product_options = pgTable('product_options', {
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
	type: text().notNull()
})

export type Product = typeof products.$inferSelect
export type ProductRequest = typeof products.$inferInsert
export type ProductOption = typeof product_options.$inferSelect
export type ProductOptionRequest = typeof product_options.$inferInsert
export type ProductsProductOptions = typeof products_product_options.$inferSelect
export type ProductsProductOptionsRequest = typeof products_product_options.$inferInsert
