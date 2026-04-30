import { setContext, getContext } from 'svelte'

type TableState = {
	active: string
}

export const setTableContext = ({ state }: { state: TableState }) => {
	setContext(`table-ctx`, state)
}

export const getTableContext = () => {
	return getContext<TableState>(`table-ctx`)
}
