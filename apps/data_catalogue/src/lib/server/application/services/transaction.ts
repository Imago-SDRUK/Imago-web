import type { Transaction } from '$lib/db'

export type ITransactionService = {
	startTransaction: <T>({
		clb,
		parent
	}: {
		clb: (tx: Transaction) => Promise<T>
		parent?: Transaction
	}) => Promise<T>
}
