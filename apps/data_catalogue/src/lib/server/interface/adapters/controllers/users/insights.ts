import type { InsightsDateRange } from '$lib/server/entities/models/insights'
import { getServerContext } from '$lib/server/application/context'
import { usersGetInsightsUseCase } from '$lib/server/application/use_cases/users/insights'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getUserModule } from '$lib/server/modules/user'

export const usersGetInsightsController = async ({
	dateRange = {},
	session,
	configuration
}: {
	dateRange?: InsightsDateRange
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) return err({ reason: 'Unauthenticated' })
	const [errors, data] = await usersGetInsightsUseCase({
		dateRange,
		users_repository: getUserModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) return err(errors)
	return ok(data)
}
