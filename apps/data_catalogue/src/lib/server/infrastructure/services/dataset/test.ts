import type { DatasetService } from '$lib/server/application/services/dataset'

const createDataset: DatasetService['createDataset'] = async () => {
	return {
		id: '',
		extras: [],
		groups: [],
		isopen: false,
		name: '',
		owner_org: '',
		metadata_created: '',
		creator_user_id: '',
		metadata_modified: '',
		private: false,
		state: '',
		title: '',
		type: '',
		resources: []
	}
}

const getDataset: DatasetService['getDataset'] = async () => {
	return {
		id: '',
		extras: [],
		groups: [],
		isopen: false,
		name: '',
		owner_org: '',
		metadata_created: '',
		creator_user_id: '',
		metadata_modified: '',
		private: false,
		state: '',
		title: '',
		type: '',
		resources: []
	}
}

const getDatasets: DatasetService['getDatasets'] = async () => {
	return {
		items: [
			{
				id: '',
				extras: [],
				groups: [],
				isopen: false,
				name: '',
				owner_org: '',
				metadata_created: '',
				creator_user_id: '',
				metadata_modified: '',
				private: false,
				state: '',
				title: '',
				type: '',
				resources: []
			}
		],
		page_size: 1,
		next: 1,
		total: 1
	}
}

const getDatasetActivity: DatasetService['getDatasetActivity'] = async () => {
	return []
}

export const infrastructureServiceDatasetTest: DatasetService = {
	getDataset,
	createDataset,
	getDatasets,
	getDatasetActivity
}
