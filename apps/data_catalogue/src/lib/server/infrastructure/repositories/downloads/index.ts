import type { DownloadsRepository } from '$lib/server/application/repositories/downloads'
import { downloadsRepositoryInfrastructureDrizzle } from '$lib/server/infrastructure/repositories/downloads/drizzle'
import { downloadsRepositoryInfrastructureTest } from '$lib/server/infrastructure/repositories/downloads/test'

export const downloadsRepositoryInfrastructure: {
	test: DownloadsRepository
	drizzle: DownloadsRepository
} = {
	drizzle: downloadsRepositoryInfrastructureDrizzle,
	test: downloadsRepositoryInfrastructureTest
}
