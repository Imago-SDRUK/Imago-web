import type { GroupsService } from '$lib/server/application/services/groups'
import { infrastructureServiceGroupsCkan } from '$lib/server/infrastructure/services/groups/ckan'
import { infrastructureServiceGroupsTest } from '$lib/server/infrastructure/services/groups/test'

export const groupsServiceInfrastructure: {
	ckan: GroupsService
	test: GroupsService
} = {
	ckan: infrastructureServiceGroupsCkan,
	test: infrastructureServiceGroupsTest
}
