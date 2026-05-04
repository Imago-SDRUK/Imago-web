import { env } from '$env/dynamic/private'
import { answersRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/answers'

export const getAnswersModule = () => {
	if (env.NODE_ENV === 'test') {
		return answersRepositoryInfrastructure['test']
	}
	return answersRepositoryInfrastructure['drizzle']
}
