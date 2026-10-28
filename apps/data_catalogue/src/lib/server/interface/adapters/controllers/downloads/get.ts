import { getServerContext } from '$lib/server/application/context'
import {
	dowloadsGetAggregatesUseCase,
	downloadsGetByDatasetUseCase
} from '$lib/server/application/use_cases/downloads/get'
import { err, ok } from '$lib/server/entities/errors'
import { type Configuration } from '$lib/server/entities/models/configuration'
import { getDatasetModule } from '$lib/server/modules/datasets'
import { getDownloadsModule } from '$lib/server/modules/downloads'
import { getResourceRepositoryModule } from '$lib/server/modules/resources'
import {downloadsGetDashboardUseCase} from '$lib/server/application/use_cases/downloads/get'
import { DateTime } from 'luxon'

export const donwloadsGetByDatasetController = async ({
	id,
	session,
	configuration
}: {
	id: string
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Missing ID' })
	}
	return await downloadsGetByDatasetUseCase({
		id,
		downloads_repository: getDownloadsModule(),
		dataset_service: getDatasetModule(),
		...getServerContext({ session, configuration })
	})
}

export const downloadsGetAggregatesController = async ({
	from,
	to,
	session,
	configuration
}: {
	from?: string | null
	to?: string | null
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, data] = await dowloadsGetAggregatesUseCase({
		from: from ?? DateTime.now().minus({ month: 1 }).toISODate() ?? '',
		to: to ?? DateTime.now().toISODate(),
		downloads_repository: getDownloadsModule(),
		resource_repository: getResourceRepositoryModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	data.sort((a, b) => b.downloads - a.downloads)
	return ok(data)
}

export const downloadsGetDashboardController = async ({
	session,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}

	const [errors, data] = await downloadsGetDashboardUseCase({
		downloads_repository: getDownloadsModule(),
		...getServerContext({ session, configuration })
	})

	if (errors !== null) {
		return err(errors)
	}

	return ok(data)
}

// const reduceAggregates = <T>(
// 	acc: { errors: ErrTypes[]; data: T[] },
// 	el: [ErrTypes, null] | [null, T]
// ) => {
// 	if (el[0] !== null) {
// 		acc.errors.push(el[0])
// 		return acc
// 	}
// 	acc.data.push(el[1])
// 	return acc
// }
