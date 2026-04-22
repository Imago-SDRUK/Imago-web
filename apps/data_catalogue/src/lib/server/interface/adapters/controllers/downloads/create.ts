import { downloads } from '$lib/db/schema'
import { getServerContext } from '$lib/server/application/context'
import { downloadsCreateUseCase } from '$lib/server/application/use_cases/downloads/create'
import { err } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getDownloadsModule } from '$lib/server/modules/downloads'
import { type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'

export const downloadCreateController = async ({
	data,
	session,
	configuration
}: {
	data: unknown
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const schema = createInsertSchema(downloads)
	const validated = schema(data)
	if (validated instanceof type.errors) {
		return err({ reason: 'Unauthorised', message: validated.summary })
	}
	return await downloadsCreateUseCase({
		data: validated,
		downloads_repository: getDownloadsModule(),
		...getServerContext({ session, configuration })
	})
}
