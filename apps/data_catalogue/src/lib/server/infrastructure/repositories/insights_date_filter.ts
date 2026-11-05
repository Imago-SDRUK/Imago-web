import { and, gte, lt, type AnyColumn } from 'drizzle-orm'
import type { InsightsDateRange } from '$lib/server/entities/models/insights'

export const insightsDateFilter = (column: AnyColumn, range: InsightsDateRange) =>
	and(range.from ? gte(column, range.from) : undefined, range.to ? lt(column, range.to) : undefined)
