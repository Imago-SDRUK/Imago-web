import type { Dataset } from '$lib/server/entities/models/datasets'
import { getContext, setContext } from 'svelte'

export const setDataset = (dataset: Dataset) => {
	const _dataset = $state({
		dataset: dataset
	})
	setContext('dataset', _dataset)
}

export const getDataset = (): { dataset: Dataset } => {
	return getContext('dataset')
}
