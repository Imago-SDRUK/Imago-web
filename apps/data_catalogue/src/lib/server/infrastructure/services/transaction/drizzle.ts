import { db } from '$lib/db'
import type { ITransactionService } from '$lib/server/application/services/transaction'

const startTransaction: ITransactionService['startTransaction'] = async ({ clb, parent }) => {
	const invoker = parent ?? db
	return invoker.transaction(clb)
}

export const transactionManagerServiceDrizzle: ITransactionService = {
	startTransaction
}
