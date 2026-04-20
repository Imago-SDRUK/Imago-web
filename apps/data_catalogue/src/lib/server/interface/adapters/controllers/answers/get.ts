import { err, ok } from '$lib/server/entities/errors'
import { answerGetUseCase } from '$lib/server/application/use_cases/answers/get'
import { getAnswersModule } from '$lib/server/modules/answers'

export const answerGetController = async ({
	session,
	id
}: {
	session: App.Locals['session']
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, answer] = await answerGetUseCase({
		id: id,
		session: session,
		answers_repository: getAnswersModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
