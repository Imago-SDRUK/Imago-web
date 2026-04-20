import { downloads } from '$lib/db/schema'
import { downloadsCreateUseCase } from '$lib/server/application/use_cases/downloads/create'
import { err } from '$lib/server/entities/errors'
import { getDownloadsModule } from '$lib/server/modules/downloads'
import { type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'

export const downloadCreateController = async ({
	data,
	session
}: {
	data: unknown
	session: App.Locals['session']
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
		session,
		downloads_repository: getDownloadsModule()
	})
}
