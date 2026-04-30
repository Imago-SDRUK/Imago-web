import { err, ok } from '$lib/server/entities/errors'
import {
	questionUpdateSortUseCase,
	questionUpdateUseCase
} from '$lib/server/application/use_cases/questions/update'
import { getQuestionsModule } from '$lib/server/modules/questions'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import type { QuestionRequest } from '$lib/server/entities/models/questions'

export const questionUpdateController = async ({
	id,
	data,
	session,
	configuration
}: {
	id: string
	data: Partial<QuestionRequest>
	session: App.Locals['session']
	configuration: Configuration
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
		questions_repository: getQuestionsModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}

export const questionUpdateSortController = async ({
	id,
	sort,
	session,
	configuration
}: {
	id: string
	sort: string
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an id', id: '' })
	}
	const [errors, answer] = await questionUpdateSortUseCase({
		id,
		sort,
		questions_repository: getQuestionsModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(answer)
}
