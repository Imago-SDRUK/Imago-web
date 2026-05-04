import type { ResourceService } from '$lib/server/application/services/resource'

const createResource: ResourceService['createResource'] = async () => {
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
		type: ''
	}
}

const getResource: ResourceService['getResource'] = async () => {
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
		type: ''
	}
}

const getResources: ResourceService['getResources'] = async () => {
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
				type: ''
			}
		],
		page_size: 1,
		next: 1
	}
}

const getResourceVersion: ResourceService['getResourceVersion'] = async () => {
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
				type: ''
			}
		],
		page_size: 1,
		next: 1
	}
}

export const datasetRepositoryInfrastructureTest: ResourceService = {
	createResource,
	getResource,
	getResourceVersion,
	getResources
}
