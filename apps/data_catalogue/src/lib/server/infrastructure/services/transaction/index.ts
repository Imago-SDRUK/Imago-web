import type { ITransactionService } from '$lib/server/application/services/transaction'
import { transactionManagerServiceDrizzle } from '$lib/server/infrastructure/services/transaction/drizzle'

export const transactionServiceInfrastructure: {
	drizzle: ITransactionService
	test: ITransactionService
} = {
	drizzle: transactionManagerServiceDrizzle,
	test: transactionManagerServiceDrizzle
}
