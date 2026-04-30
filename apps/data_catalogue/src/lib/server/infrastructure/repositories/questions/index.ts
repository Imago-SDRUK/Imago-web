import type { QuestionsRepository } from '$lib/server/application/repositories/questions'
import { questionsRepositoryInfrastructureDrizzle } from '$lib/server/infrastructure/repositories/questions/drizzle'
import { questionsRepositoryInfrastructureTest } from '$lib/server/infrastructure/repositories/questions/test'

export const questionsRepositoryInfrastructure: {
	test: QuestionsRepository
	drizzle: QuestionsRepository
} = {
	test: questionsRepositoryInfrastructureTest,
	drizzle: questionsRepositoryInfrastructureDrizzle
}
