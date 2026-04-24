import {
	pgTable,
	uuid,
	timestamp,
	text,
	primaryKey,
	pgEnum,
	index,
	boolean
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { DateTime } from 'luxon'
import { type } from 'arktype'
import { v7 as uuidv7 } from 'uuid'

export const group_status_enum = pgEnum('group_status_enum', [
	'draft',
	'active',
	'archived',
	'suspended'
])

export const group_visibility_enum = pgEnum('group_visibility', ['private', 'public'])

export const groups = pgTable(
	'groups',
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
		status: group_status_enum().default('draft').notNull(),
		title: text().unique().notNull(),
		slug: text().unique().notNull(),
		description: text(),
		datasets: uuid().array(),
		visibility: group_visibility_enum().default('private').notNull(),
		autoenroll: boolean().default(false)
	},
	(table) => [index('groups_slug_idx').on(table.slug)]
)

export const users_groups = pgTable(
	'users_groups',
	{
		created_by: uuid().references(() => users.id, { onDelete: 'set null' }),
		updated_by: uuid().references(() => users.id, { onDelete: 'set null' }),
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
		user_id: uuid('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		group_id: uuid('group_id')
			.notNull()
			.references(() => groups.id, { onDelete: 'cascade' })
	},
	(t) => [
		primaryKey({ columns: [t.user_id, t.group_id] }),
		index('users_groups_group_idx').on(t.group_id),
		index('users_groups_user_idx').on(t.user_id)
	]
)

export const groups_relations = relations(groups, ({ many }) => ({
	users_to_groups: many(users_groups)
}))

export const users_to_groups_relations = relations(users_groups, ({ one }) => ({
	group: one(groups, {
		fields: [users_groups.group_id],
		references: [groups.id]
	}),
	user: one(users, {
		fields: [users_groups.user_id],
		references: [users.id]
	})
}))

export type Group = typeof groups.$inferSelect
export type GroupRequest = typeof groups.$inferInsert

export type GroupService = {
	approval_status: string
	created: string
	description: string
	display_name: string
	id: string
	image_display_url: string
	image_url: string
	is_organization: boolean
	name: string
	num_followers: number
	package_count: number
	state: string
	title: string
	type: string
}

export const GroupServiceSchema = type({
	name: 'string',
	'id?': 'string',
	'title?': 'string',
	'description?': 'string | null'
})

export const GroupServiceUpdateSchema = type({
	'title?': 'string',
	'description?': 'string | null'
})

export type GroupServiceRequest = typeof GroupServiceSchema.infer
export type GroupServiceUpdateRequest = typeof GroupServiceUpdateSchema.infer

//
// export type GroupServiceRequest = {
// 	name: string
// 	title: string
// }

export type UsersGroups = typeof users_groups.$inferSelect
export type UsersGroupsRequest = typeof users_groups.$inferInsert
