import { pgEnum } from 'drizzle-orm/pg-core'

// NOTE: Define enum as its required by Postgres. Each schema file should implement their own reusable columns

export const status_enum = pgEnum('status_enum', ['published', 'archived', 'draft'])

// export const getReusable = () => {
// 	return {
// 		created_by: uuid()
// 			.references(() => users.id, { onDelete: 'no action' })
// 			.notNull(),
// 		updated_by: uuid()
// 			.references(() => users.id, { onDelete: 'no action' })
// 			.notNull(),
// 		status: status_enum().default('draft').notNull(),
// 		created_at: timestamp({
// 			mode: 'date',
// 			precision: 3,
// 			withTimezone: true
// 		})
// 			.defaultNow()
// 			.notNull(),
// 		updated_at: timestamp({
// 			mode: 'date',
// 			precision: 3,
// 			withTimezone: true
// 		})
// 			.defaultNow()
// 			.notNull()
// 			.$onUpdateFn(() => DateTime.now().toBSON()),
// 		deleted_at: timestamp({
// 			mode: 'date',
// 			precision: 3,
// 			withTimezone: true
// 		})
// 			.defaultNow()
// 			.notNull()
// 	}
// }
