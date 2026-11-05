import type { InsightsDateRange } from '$lib/server/entities/models/insights'
import type { AppContext } from '$lib/server/application/context'
import type { IUsersRepository } from '$lib/server/application/repositories/users'
import { err, ok } from '$lib/server/entities/errors'

export const usersGetInsightsUseCase = async ({
	dateRange = {},
	users_repository,
	authorisation_module,
	session,
	configuration
}: {
	dateRange?: InsightsDateRange
	users_repository: IUsersRepository
} & AppContext) => {
	const [permission_errors, permission] = await authorisation_module.authorise({
		namespace: 'Application',
		object: 'dashboard',
		permits: 'read',
		actor: session.identity.id,
		configuration
	})
	if (permission_errors) return err(permission_errors)
	if (!permission.allowed) return err({ reason: 'Unauthorised' })
	const [totalUsersErrors, totalUsers] = await users_repository.getTotalUsers(dateRange)
	if (totalUsersErrors !== null) return err(totalUsersErrors)
	const [usersWithDownloadsErrors, usersWithDownloads] =
		await users_repository.getUsersWithDownloads(dateRange)
	if (usersWithDownloadsErrors !== null) return err(usersWithDownloadsErrors)
	const [usersByCountryErrors, usersByCountry] = await users_repository.getUsersByCountry(dateRange)
	if (usersByCountryErrors !== null) return err(usersByCountryErrors)
	const [usersByCategoryErrors, usersByCategory] =
		await users_repository.getUsersByCategory(dateRange)
	if (usersByCategoryErrors !== null) return err(usersByCategoryErrors)
	return ok({ totalUsers, usersWithDownloads, usersByCountry, usersByCategory })
}
