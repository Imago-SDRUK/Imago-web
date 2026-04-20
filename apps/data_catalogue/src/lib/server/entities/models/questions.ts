import {
	pgTable,
	uuid,
	text,
	boolean,
	pgEnum,
	numeric,
	time,
	timestamp,
	jsonb,
	index
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { DateTime } from 'luxon'
import { users } from './users'

const status_enum = pgEnum('status_enum', ['published', 'archived', 'draft'])
const reuse = () => ({
	created_by: uuid().references(() => users.id, { onDelete: 'cascade' }),
	updated_by: uuid().references(() => users.id, { onDelete: 'cascade' }),
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
		.$onUpdateFn(() => DateTime.now().toBSON()),
	deleted_at: timestamp({
		mode: 'date',
		precision: 3,
		withTimezone: true
	})
})

export const question_type_enum = pgEnum('question_type_enum', [
	'string',
	'select',
	'multiple_select',
	'number',
	'bool',
	'countries'
])

export const questions = pgTable(
	'questions',
	{
		id: uuid().primaryKey().defaultRandom(),
		question: text().notNull(),
		description: text(),
		label: text(),
		required: boolean(),
		group: text(),
		type: question_type_enum().default('string'),
		options: jsonb().$type<{ label: string; value: string }[]>().default([]),
		conditionals: jsonb()
			.$type<
				{
					question: string
					value: string
					operator: 'equal' | 'not_equal' | 'includes'
					action: 'visible' | 'hidden'
				}[]
			>()
			.default([]),
		visibility: boolean().default(false),
		...reuse()
	}
	// NOTE: this is breaking the website
	// (table) => [
	// 	index('question_published_idx')
	// 		.on(table?.status)
	// 		.where(sql`${table?.status} = 'published'`)
	// ]
)

export const answers = pgTable(
	'answers',
	{
		id: uuid().primaryKey().defaultRandom(),
		free_text: text(),
		number: numeric(),
		bool: boolean(),
		time: time(),
		answer: text(),
		question_reference: text(),
		question: uuid()
			.notNull()
			.references(() => questions.id, { onDelete: 'cascade' }),
		...reuse()
	},
	(table) => [index('user_question_idx').on(table.created_by, table.question)]
)

export const question_answers = relations(questions, ({ many }) => ({
	answers: many(answers)
}))

export const answer_question = relations(answers, ({ one }) => ({
	question: one(questions, {
		fields: [answers.question],
		references: [questions.id]
	})
}))

export type QuestionRequest = typeof questions.$inferInsert
export type AnswerRequest = typeof answers.$inferInsert

export type Question = typeof questions.$inferSelect
export type Answer = typeof answers.$inferSelect
