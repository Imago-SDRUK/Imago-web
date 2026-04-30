import { env } from '$env/dynamic/private'
import { questionsRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/questions'

export const getQuestionsModule = () => {
	if (env.NODE_ENV === 'test') {
		return questionsRepositoryInfrastructure['test']
	}
	return questionsRepositoryInfrastructure['drizzle']
}
