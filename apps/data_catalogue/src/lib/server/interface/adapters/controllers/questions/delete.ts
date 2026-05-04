import { err, ok } from '$lib/server/entities/errors'
import { getQuestionsModule } from '$lib/server/modules/questions'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { questionDeleteUseCase } from '$lib/server/application/use_cases/questions/delete'

export const questionDeleteController = async ({
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
		return err({ reason: 'Invalid Data', message: 'You need to provide an id', id: '' })
	}
	const [errors, answer] = await questionDeleteUseCase({
		id,
		questions_repository: getQuestionsModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
