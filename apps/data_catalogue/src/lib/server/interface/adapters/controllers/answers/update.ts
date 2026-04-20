import { err, ok } from '$lib/server/entities/errors'
import { getAnswersModule } from '$lib/server/modules/answers'
import { answerUpdateUseCase } from '$lib/server/application/use_cases/answers/update'

export const answerUpdateController = async ({
	id,
	data,
	session
}: {
	id: string
	data: unknown
	session: App.Locals['session']
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
		session: session,
		answers_repository: getAnswersModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
