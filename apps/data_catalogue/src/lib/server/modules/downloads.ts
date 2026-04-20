import { env } from '$env/dynamic/private'
import { downloadsRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/downloads'

export const getDownloadsModule = () => {
	if (env.NODE_ENV === 'test') {
		return downloadsRepositoryInfrastructure['test']
	}
	return downloadsRepositoryInfrastructure['drizzle']
}
