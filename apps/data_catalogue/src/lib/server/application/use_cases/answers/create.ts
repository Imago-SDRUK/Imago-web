import type { AnswerRequest } from '$lib/server/entities/models/questions'
import type { AnswersRepository } from '$lib/server/application/repositories/answers'
import type { PermissionRequest } from '$lib/server/entities/models/permissions'
import type { AuthorisationService } from '$lib/server/application/services/autorisation'
import type { AppContext } from '$lib/server/application/context'
import { err, ok } from '$lib/server/entities/errors'
import { answers } from '$lib/db/schema'
import { ArkErrors, type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'
import { getAnswerBasePermissions } from '$lib/server/entities/models/policies'

export const answerCreateUseCase = async ({
	data,
	answers_repository,
	session,
	authorisation_module,
	configuration
}: {
	data: unknown
	answers_repository: AnswersRepository
	authorisation_module: AuthorisationService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'answers',
		permits: 'create',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createInsertSchema(answers)
	const validated = schema(data)
	if (validated instanceof type.errors) {
		return err({ reason: 'Unauthorised', message: validated.summary })
	}

	const [errs, answer] = await answers_repository.createAnswer({ data: validated })
	if (errs !== null) {
		return err(errs)
	}
	return ok(answer)
}

export const answersCreateUseCase = async ({
	data,
	answers_repository,
	session,
	configuration,
	authorisation_module
}: {
	data: unknown[]
	answers_repository: AnswersRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'answers',
		permits: 'create',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createInsertSchema(answers)
	const validated = data.map((values) => schema(values))
	const { data_errors, valid } = validated.reduce(
		(acc, values) => {
			if (values instanceof type.errors) {
				acc.data_errors.push(values)
				return acc
			}
			acc.valid.push(values)
			return acc
		},
		{ data_errors: [], valid: [] } as { data_errors: ArkErrors[]; valid: AnswerRequest[] }
	)
	if (data_errors.length > 0) {
		return err({ reason: 'Unauthorised', message: data_errors[0].summary })
	}
	const [errs, user_answers] = await answers_repository.createAnswers({ data: valid })
	if (errs !== null) {
		return err(errs)
	}
	const permissions: PermissionRequest[] = user_answers.flatMap((answer) =>
		getAnswerBasePermissions({
			user_id: session.identity.id,
			answer,
			admin_group: configuration.admin_group
		})
	)
	const [p_errs] = await authorisation_module.createPermissions({ permissions })
	if (p_errs !== null) {
		return err(p_errs)
	}

	return ok(user_answers)
}
