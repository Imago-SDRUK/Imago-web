import { env } from '$env/dynamic/private'
import { transactionServiceInfrastructure } from '$lib/server/infrastructure/services/transaction'

export const getTransactionModule = () => {
	if (env.NODE_ENV === 'test') {
		return transactionServiceInfrastructure['test']
	}
	return transactionServiceInfrastructure['drizzle']
}
