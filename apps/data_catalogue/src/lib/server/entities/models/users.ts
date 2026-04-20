import { pgTable, uuid, jsonb, index, pgEnum, timestamp, text, varchar } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { DateTime } from 'luxon'
import { users_groups } from './groups'

export const user_status_enum = pgEnum('user_status_enum', [
	'preregister',
	'active',
	'archived',
	'draft',
	'suspended'
])

const timestamps = {
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
	deleted_at: timestamp({
		mode: 'date',
		precision: 3,
		withTimezone: true
	})
}

export const users = pgTable(
	'users',
	{
		id: uuid().primaryKey().defaultRandom(),
		preferences: jsonb('preferences').$type<{
			notifications: boolean
		}>(),
		// email: varchar('email', { length: 320 }).notNull().default(''),
		// first_name: varchar('name', { length: 100 }).notNull().default(''),
		// last_name: varchar('name', { length: 100 }).notNull().default(''),
		groups: text().array(),
		status: user_status_enum().default('draft').notNull(),
		...timestamps
	},
	(table) => [
		index('users_active_idx')
			.on(table.id)
			.where(sql`${table.status} = 'active'`)
	]
)

export type UserRequest = typeof users.$inferInsert
export type User = typeof users.$inferSelect

export const users_relations = relations(users, ({ many }) => ({
	users_to_groups: many(users_groups)
}))

// NOTE: this breaks shared timestamps
// export const userAnswers = relations(users, ({ many }) => ({
// 	answers: many(answers)
// }))
