import { DateTime } from 'luxon'
import type { InsightsDateRange } from '$lib/server/entities/models/insights'

export const parseInsightsDateRange = (from: string, to: string): InsightsDateRange => {
	const parse = (value: string) => {
		const date = DateTime.fromISO(value, { zone: 'Europe/London' })
		if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !date.isValid) {
			throw new Error('Please enter valid dates in YYYY-MM-DD format.')
		}
		return date.startOf('day')
	}
	const start = from ? parse(from) : undefined
	const end = to ? parse(to) : undefined
	if (start && end && start > end)
		throw new Error('The start date must be on or before the end date.')
	return { from: start?.toJSDate(), to: end?.plus({ days: 1 }).toJSDate() }
}
