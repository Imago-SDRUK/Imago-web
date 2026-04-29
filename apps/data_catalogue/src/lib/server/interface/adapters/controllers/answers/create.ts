import { err, ok } from '$lib/server/entities/errors'
import { getAnswersModule } from '$lib/server/modules/answers'
import {
	answerCreateUseCase,
	answersCreateUseCase
} from '$lib/server/application/use_cases/answers/create'
import { getServerContext } from '$lib/server/application/context'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { log } from '$lib/utils/server/logger'

export const answerCreateController = async ({
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
	const [errors, answer] = await answerCreateUseCase({
		data,
		answers_repository: getAnswersModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}

export const answersCreateController = async ({
	data,
	session,
	configuration
}: {
	data: unknown[]
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!Array.isArray(data)) {
		return err({ reason: 'Invalid Data', message: 'Data needs to be an array', id: '' })
	}
	const [errors, answer] = await answersCreateUseCase({
		data,
		answers_repository: getAnswersModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		log.error({ controller: 'answersCreateController', error: errors })
		return err(errors)
	}
	return ok(answer)
}
