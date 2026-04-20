import type { GroupsService } from '$lib/server/application/services/groups'

export const infrastructureServiceGroupsTest: GroupsService = {
	createGroup: async () => {
		return {
			id: '',
			state: '',
			approval_status: '',
			created: '',
			description: '',
			display_name: '',
			image_display_url: '',
			image_url: '',
			is_organization: false,
			name: '',
			num_followers: 0,
			package_count: 0,
			title: '',
			type: ''
		}
	},
	getGroup: async () => {
		return {
			id: '',
			state: '',
			approval_status: '',
			created: '',
			description: '',
			display_name: '',
			image_display_url: '',
			image_url: '',
			is_organization: false,
			name: '',
			num_followers: 0,
			package_count: 0,
			title: '',
			type: ''
		}
	},
	getGroups: async () => {
		return []
	}
}
