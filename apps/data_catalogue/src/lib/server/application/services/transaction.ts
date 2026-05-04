import type { Transaction } from '$lib/db'
import type { ITransaction } from '$lib/server/entities/models/transaction'

export type ITransactionService = {
	startTransaction: <T>({
		clb,
		parent
	}: {
		clb: (tx: Transaction) => Promise<T>
		parent?: Transaction
	}) => Promise<T>
}
