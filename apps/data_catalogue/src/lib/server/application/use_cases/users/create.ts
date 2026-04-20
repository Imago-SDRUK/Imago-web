import type { UserRequest } from '$lib/server/entities/models/users'
import type { UsersRepository } from '$lib/server/application/repositories/users'
import { err, ok } from '$lib/server/entities/errors'

export const userCreateUseCase = async ({
	payload,
	repository
}: {
	payload: UserRequest
	repository: UsersRepository
}) => {
	return await repository
		.createUser({ data: payload })
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
}
