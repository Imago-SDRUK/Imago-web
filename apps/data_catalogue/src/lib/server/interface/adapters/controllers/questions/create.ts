import { questionCreateUseCase } from '$lib/server/application/use_cases/questions/create'
import { err, ok } from '$lib/server/entities/errors'
import { getQuestionsModule } from '$lib/server/modules/questions'

export const questionCreateController = async ({
	data,
	session
}: {
	data: unknown
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, answer] = await questionCreateUseCase({
		data,
		session: session,
		questions_repository: getQuestionsModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
