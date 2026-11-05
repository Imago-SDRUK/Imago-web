import { insightsDateFilter } from '../insights_date_filter'
import { db } from '$lib/db'
import { answers, downloads, resources } from '$lib/db/schema'
import type { IAnswersRepository } from '$lib/server/application/repositories/answers'
import { err, ok } from '$lib/server/entities/errors'
import { and, eq, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

const createAnswer: IAnswersRepository['createAnswer'] = async ({ data, tx }) => {
	try {
		const _db = tx ?? db

		const answer = await _db.insert(answers).values(data).returning()

		return ok(answer[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const createAnswers: IAnswersRepository['createAnswers'] = async ({ data }) => {
	try {
		const answer = await db.insert(answers).values(data).returning()

		return ok(answer)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateAnswer: IAnswersRepository['updateAnswer'] = async ({ id, data }) => {
	try {
		const answer = await db.update(answers).set(data).where(eq(answers.id, id)).returning()

		return ok(answer[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getAnswer: IAnswersRepository['getAnswer'] = async ({ id }) => {
	try {
		const answer = await db.select().from(answers).where(eq(answers.id, id))

		return ok(answer[0])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deleteAnswer: IAnswersRepository['deleteAnswer'] = async ({ id }) => {
	try {
		await db.delete(answers).where(eq(answers.id, id))

		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

// Aliases for answers table

const categoryAnswers = alias(answers, 'category')

// Total number of newsletter opt-ins

const getTotalNewsletterSignUps: IAnswersRepository['getTotalNewsletterSignUps'] = async (
	dateRange = {}
) => {
	try {
		const result = await db
			.select({
				total: sql<number>`
						cast(
							count(distinct ${answers.created_by})
							as int
						)
					`.as('total')
			})
			.from(answers)
			.where(
				and(
					eq(
						answers.question_reference,
						'I’d like to receive updates about news, activities, events, and new data products released by Imago.'
					),
					eq(answers.answer, 'on'),
					insightsDateFilter(answers.created_at, dateRange)
				)
			)

		return ok(result[0]?.total ?? 0)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

// Top downloaded dataset by category

const getTopDownloadedResourcesByCategory: IAnswersRepository['getTopDownloadedResourcesByCategory'] =
	async (dateRange = {}) => {
		try {
			const ranked = db
				.select({
					category: categoryAnswers.answer,
					resource_id: resources.id,
					resource_title: resources.title,
					download_count: sql<number>`
						cast(count(*) as int)
					`.as('download_count'),
					rank: sql<number>`
						row_number() over (
							partition by ${categoryAnswers.answer}
							order by count(*) desc
						)
					`.as('rank')
				})
				.from(downloads)
				.innerJoin(categoryAnswers, eq(categoryAnswers.created_by, downloads.user))
				.innerJoin(resources, eq(resources.id, downloads.resource))
				.where(
					and(
						eq(categoryAnswers.question_reference, 'Which category best describe you?'),
						insightsDateFilter(downloads.created_at, dateRange)
					)
				)
				.groupBy(categoryAnswers.answer, resources.id, resources.title)
				.as('ranked')

			const result = await db
				.select({
					category: ranked.category,
					resource_id: ranked.resource_id,
					resource_title: ranked.resource_title,
					download_count: ranked.download_count
				})
				.from(ranked)
				.where(eq(ranked.rank, 1))
				.orderBy(ranked.category)

			return ok(
				result.map((row) => ({
					category: row.category ?? '',
					resource_id: row.resource_id,
					resource_title: row.resource_title,
					download_count: row.download_count
				}))
			)
		} catch (_err) {
			return err({ reason: 'Unexpected', error: _err })
		}
	}

export const answersRepositoryInfrastructureDrizzle: IAnswersRepository = {
	createAnswer,
	createAnswers,
	deleteAnswer,
	getAnswer,
	updateAnswer,
	getTotalNewsletterSignUps,
	getTopDownloadedResourcesByCategory
}
