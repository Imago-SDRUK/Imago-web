import { err, ok } from '$lib/server/entities/errors'
import { getAnswersModule } from '$lib/server/modules/answers'
import {
	answerCreateUseCase,
	answersCreateUseCase
} from '$lib/server/application/use_cases/answers/create'

export const answerCreateController = async ({
	data,
	session
}: {
	data: unknown
	session: App.Locals['session']
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, answer] = await answerCreateUseCase({
		data,
		session: session,
		answers_repository: getAnswersModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}

export const answersCreateController = async ({
	data,
	session
}: {
	data: unknown[]
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!Array.isArray(data)) {
		return err({ reason: 'Invalid Data', message: 'Data needs to be an array', id: '' })
	}
	const [errors, answer] = await answersCreateUseCase({
		data,
		session: session,
		answers_repository: getAnswersModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
