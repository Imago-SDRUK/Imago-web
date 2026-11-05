import { parseInsightsDateRange } from '$lib/server/application/insights/date_range'
import { usersGetInsightsController } from '$lib/server/interface/adapters/controllers/users/insights'
import { downloadsGetDashboardController } from '$lib/server/interface/adapters/controllers/downloads/get'
import { answersGetInsightsController } from '$lib/server/interface/adapters/controllers/answers/insights'
import { error } from '@sveltejs/kit'

export const load = async ({ locals, url }) => {
	const from = url.searchParams.get('from') ?? ''
	const to = url.searchParams.get('to') ?? ''
	let dateRange
	try {
		dateRange = parseInsightsDateRange(from, to)
	} catch (cause) {
		error(400, {
			id: 'invalid-insights-date-range',
			message: cause instanceof Error ? cause.message : 'Invalid date range'
		})
	}

	const [downloadErrors, downloads] = await downloadsGetDashboardController({
		dateRange,
		session: locals.session,
		configuration: locals.configuration
	})

	if (downloadErrors !== null) {
		error(500, {
			id: 'downloads-load-failed',
			message: 'Failed to load download insights'
		})
	}

	const [answerErrors, insights] = await answersGetInsightsController({
		dateRange,
		session: locals.session,
		configuration: locals.configuration
	})

	if (answerErrors !== null) {
		error(500, {
			id: 'insights-load-failed',
			message: 'Failed to load newsletter and category download insights'
		})
	}

	const [userErrors, userInsights] = await usersGetInsightsController({
		dateRange,
		session: locals.session,
		configuration: locals.configuration
	})
	if (userErrors !== null) {
		error(500, { id: 'users-insights-load-failed', message: 'Failed to load user insights' })
	}

	return {
		filters: { from, to },
		userInsights,
		downloads,
		insights
	}
}
