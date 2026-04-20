import { err, ok } from '$lib/server/entities/errors'
import { questionUpdateUseCase } from '$lib/server/application/use_cases/questions/update'
import { getQuestionsModule } from '$lib/server/modules/questions'

export const questionsUpdateController = async ({
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
	const [errors, answer] = await questionUpdateUseCase({
		id,
		data,
		session: session,
		questions_repository: getQuestionsModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
