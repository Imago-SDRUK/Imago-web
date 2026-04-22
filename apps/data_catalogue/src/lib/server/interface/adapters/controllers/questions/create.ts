import { getServerContext } from '$lib/server/application/context'
import { questionCreateUseCase } from '$lib/server/application/use_cases/questions/create'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getQuestionsModule } from '$lib/server/modules/questions'

export const questionCreateController = async ({
	data,
	session,
	configuration
}: {
	data: unknown
	configuration: Configuration
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, answer] = await questionCreateUseCase({
		data,
		questions_repository: getQuestionsModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
