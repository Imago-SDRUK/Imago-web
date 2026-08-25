import type { IQuestionsRepository } from '$lib/server/application/repositories/questions'
import type { AppContext } from '$lib/server/application/context'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { err, ok } from '$lib/server/entities/errors'

export const questionGetUseCase = async ({
	id,
	session,
	questions_repository,
	authorisation_module,
	configuration
}: {
	id: string
	questions_repository: IQuestionsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Question',
		object: id,
		permits: 'read',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, question] = await questions_repository.getQuestion({ id })
	if (errs !== null) {
		return err(errs)
	}
	return ok(question)
}

export const questionsGetUseCase = async ({
	limit = 50,
	offset = 0,
	session,
	questions_repository
	// authorisation_module,
	// configuration
}: {
	limit?: number
	offset?: number
	questions_repository: IQuestionsRepository
	session: App.Locals['session']
	configuration: Configuration
} & AppContext) => {
	// make so questions can be read by any authenticated user, later on permissions for questions could be reinstated if necessary
	if (session.identity.id === 'anonymous') {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, questions] = await questions_repository.getQuestions({ limit, offset })
	if (errs !== null) {
		return err(errs)
	}

	// const allowed = await Promise.all(
	// 	questions.map((question) =>
	// 		authorisation_module
	// 			.authorise({
	// 				actor: session.identity.id,
	// 				namespace: 'Question',
	// 				object: question.id,
	// 				permits: 'read',
	// 				configuration
	// 			})
	// 			.then(([errors, allowed]) => {
	// 				console.log(`question ${question.id} is ${allowed?.allowed}`)
	// 				if (errors !== null) {
	// 					return null
	// 				}
	// 				if (allowed.allowed) {
	// 					return question.id
	// 				}
	// 				return null
	// 			})
	// 	)
	// )
	// const filtered = questions.filter((question) => allowed.find((id) => id === question.id))
	return ok(questions)
}
