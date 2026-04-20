import { users } from '$lib/db/schema'
import { getUserModule } from '$lib/server/modules/user'
import type { Session } from '$lib/server/entities/models/identity'
import { err, ok } from '$lib/server/entities/errors'
import { createUpdateSchema } from 'drizzle-arktype'
import { type } from 'arktype'
import { userUpdateUseCase } from '$lib/server/application/use_cases/users/update'

// const presenter = ({ user }: { user: User }) => ({
// 	id: user.id,
// 	status: user.status
// })

export const userUpdateController = async ({
	id,
	session,
	payload
}: {
	id?: string
	session?: Session
	payload: unknown
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an id.', id: '' })
	}
	const schema = createUpdateSchema(users)
	const validated = schema(payload)
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: '' })
	}
	const [errs, user] = await userUpdateUseCase({
		data: validated,
		session,
		id,
		user_repository: getUserModule()
	})
	if (errs !== null) {
		return err(errs)
	}
	return ok(user)
}
