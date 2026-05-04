import type { Configuration } from '$lib/server/entities/models/configuration'
import type { Session } from '$lib/server/entities/models/identity'
import { getServerContext } from '$lib/server/application/context'
import { actionGetUseCase } from '$lib/server/application/use_cases/actions/get'
import { err, ok } from '$lib/server/entities/errors'

export const actionCheckController = async ({
	object,
	permits,
	configuration,
	session
}: {
	object?: string
	permits?: string
	session?: Session
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, res] = await actionGetUseCase({
		object,
		permits,
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(res)
}
