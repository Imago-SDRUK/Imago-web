import type { Configuration } from '$lib/server/entities/models/configuration'
import { err, ok } from '$lib/server/entities/errors'
import { getAnswersModule } from '$lib/server/modules/answers'
import { answerUpdateUseCase } from '$lib/server/application/use_cases/answers/update'
import { getServerContext } from '$lib/server/application/context'

export const answerUpdateController = async ({
	id,
	data,
	session,
	configuration
}: {
	id: string
	data: unknown
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an id', id: '' })
	}
	const [errors, answer] = await answerUpdateUseCase({
		id,
		data,
		answers_repository: getAnswersModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
