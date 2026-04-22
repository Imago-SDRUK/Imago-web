import { users } from '$lib/db/schema'
import { validateInsert } from '$lib/db/validation'
import { userCreateUseCase } from '$lib/server/application/use_cases/users/create'
import { getUserModule } from '$lib/server/modules/user'
import { log } from '$lib/utils/server/logger'
import type { Session } from '$lib/server/entities/models/identity'
import { err } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'

// const presenter = ({ user }: { user: User }) => ({
// 	id: user.id,
// 	status: user.status
// })

export const userCreateController = async ({
	session,
	payload,
	configuration
}: {
	session: Session
	payload: unknown
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}

	const validated_payload = validateInsert(users, payload)
	if (validated_payload.success) {
		// create user
		return await userCreateUseCase({
			payload: validated_payload.data,
			repository: getUserModule()
		})
		// add user to group
		//
		// return presenter({ user })
	}
	log.error(validated_payload.errors)
	return err({ reason: 'Invalid Data', id: '', message: '', errors: validated_payload })
}
