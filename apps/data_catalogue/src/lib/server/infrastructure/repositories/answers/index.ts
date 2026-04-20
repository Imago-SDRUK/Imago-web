import type { AnswersRepository } from '$lib/server/application/repositories/answers'
import { answersRepositoryInfrastructureDrizzle } from '$lib/server/infrastructure/repositories/answers/drizzle'
import { answersRepositoryInfrastructureTest } from '$lib/server/infrastructure/repositories/answers/test'

export const answersRepositoryInfrastructure: {
	test: AnswersRepository
	drizzle: AnswersRepository
} = {
	test: answersRepositoryInfrastructureTest,
	drizzle: answersRepositoryInfrastructureDrizzle
}
