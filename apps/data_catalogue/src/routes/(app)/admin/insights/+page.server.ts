import { downloadsGetDashboardController } from '$lib/server/interface/adapters/controllers/downloads/get'
import { answersGetInsightsController } from '$lib/server/interface/adapters/controllers/answers/insights'
import { error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
    const [downloadErrors, downloads] =
        await downloadsGetDashboardController({
            session: locals.session,
            configuration: locals.configuration
        })

    if (downloadErrors !== null) {
        error(500, {
            id: 'downloads-load-failed',
            message: 'Failed to load download insights'
        })
    }

    const [answerErrors, insights] =
        await answersGetInsightsController({
            session: locals.session,
            configuration: locals.configuration
        })

    if (answerErrors !== null) {
        error(500, {
            id: 'insights-load-failed',
            message: 'Failed to load sign-up insights'
        })
    }

    return {
        downloads,
        insights
    }
}

