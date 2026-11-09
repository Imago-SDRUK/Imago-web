import type { InsightsDateRange } from '$lib/server/entities/models/insights'
import type { AppContext } from '$lib/server/application/context'
import type { IAnswersRepository } from '$lib/server/application/repositories/answers'
import { err, ok } from '$lib/server/entities/errors'

export const answersGetInsightsUseCase = async ({
	dateRange = {},
	answers_repository,
	authorisation_module,
	session,
	configuration
}: {
	dateRange?: InsightsDateRange
	answers_repository: IAnswersRepository
} & AppContext) => {
	const [permission_errors, permission] = await authorisation_module.authorise({
		namespace: 'Application',
		object: 'dashboard',
		permits: 'read',
		actor: session.identity.id,
		configuration
	})

	if (permission_errors) {
		return err(permission_errors)
	}

	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [total_errors, totalNewsletterSignUps] =
		await answers_repository.getTotalNewsletterSignUps(dateRange)

	if (total_errors !== null) {
		return err(total_errors)
	}

	const [top_errors, topDownloadedResourcesByCategory] =
		await answers_repository.getTopDownloadedResourcesByCategory(dateRange)

	if (top_errors !== null) {
		return err(top_errors)
	}

	return ok({
		totalNewsletterSignUps,
		topDownloadedResourcesByCategory
	})
}
