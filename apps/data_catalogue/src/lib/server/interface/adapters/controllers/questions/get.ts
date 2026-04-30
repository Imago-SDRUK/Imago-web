import { getServerContext } from '$lib/server/application/context'
import {
	questionGetUseCase,
	questionsGetUseCase
} from '$lib/server/application/use_cases/questions/get'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getQuestionsModule } from '$lib/server/modules/questions'

export const questionGetController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	id: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, answer] = await questionGetUseCase({
		id: id,
		questions_repository: getQuestionsModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}

export const questionsGetController = async ({
	session,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, answer] = await questionsGetUseCase({
		questions_repository: getQuestionsModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
