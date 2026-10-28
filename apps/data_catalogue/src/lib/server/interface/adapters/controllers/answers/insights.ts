import { getServerContext } from '$lib/server/application/context'
import { answersGetInsightsUseCase } from '$lib/server/application/use_cases/answers/insights'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getAnswersModule } from '$lib/server/modules/answers'

export const answersGetInsightsController = async ({
	session,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}

	try {
		const [errors, data] = await answersGetInsightsUseCase({
			answers_repository: getAnswersModule(),
			...getServerContext({ session, configuration })
		})

		if (errors !== null) {
			console.error('ANSWERS INSIGHTS ERROR:', errors)
			return err(errors)
		}

		return ok(data)
	} catch (error) {
		console.error('ANSWERS INSIGHTS CRASH:', error)
		throw error
	}
}

