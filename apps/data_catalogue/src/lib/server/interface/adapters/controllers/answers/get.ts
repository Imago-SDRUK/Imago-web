import type { Configuration } from '$lib/server/entities/models/configuration'
import { err, ok } from '$lib/server/entities/errors'
import { answerGetUseCase } from '$lib/server/application/use_cases/answers/get'
import { getAnswersModule } from '$lib/server/modules/answers'
import { getServerContext } from '$lib/server/application/context'

export const answerGetController = async ({
	id,
	configuration,
	session
}: {
	session: App.Locals['session']
	id: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, answer] = await answerGetUseCase({
		id: id,
		answers_repository: getAnswersModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
