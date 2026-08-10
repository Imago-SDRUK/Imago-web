import type { IUsersService } from '$lib/server/application/services/users'
import { infrastructureServiceUsersCkan } from '$lib/server/infrastructure/services/users/ckan'

export const userServiceInfrastructure: {
	ckan: IUsersService
	test: IUsersService
} = {
	ckan: infrastructureServiceUsersCkan,
	// TODO: mock service
	test: infrastructureServiceUsersCkan
}
