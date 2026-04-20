import {
	questionGetUseCase,
	questionsGetUseCase
} from '$lib/server/application/use_cases/questions/get'
import { err, ok } from '$lib/server/entities/errors'
import { getQuestionsModule } from '$lib/server/modules/questions'

export const questionGetController = async ({
	session,
	id
}: {
	session: App.Locals['session']
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, answer] = await questionGetUseCase({
		id: id,
		session: session,
		questions_repository: getQuestionsModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}

export const questionsGetController = async ({ session }: { session: App.Locals['session'] }) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, answer] = await questionsGetUseCase({
		session: session,
		questions_repository: getQuestionsModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
