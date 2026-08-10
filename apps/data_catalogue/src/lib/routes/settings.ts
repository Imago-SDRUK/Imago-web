import type { Routes, Tab } from '@imago/ui'
type NavigationFeatures =
	| 'datasets'
	| 'groups'
	// | 'permissions'
	| 'registration'
	| 'users'
	| 'configuration'

export const settings_routes: Record<
	NavigationFeatures,
	({ id }: { id?: string }) => { group: string; route: Tab }
> = {
	configuration: () => ({
		group: 'Settings',
		route: {
			label: 'Configuration',
			href: `/admin/settings/configuration`
		}
	}),
	datasets: () => ({
		group: 'Settings',
		route: {
			label: 'Datasets',
			href: `/admin/settings/datasets`
		}
	}),
	groups: () => ({
		group: 'Settings',
		route: {
			label: 'Groups',
			href: `/admin/settings/groups`
		}
	}),
	// permissions: () => ({
	// 	group: 'Settings',
	// 	route: {
	// 		label: 'Permissions',
	// 		href: `/admin/settings/permissions`
	// 	}
	// }),
	registration: () => ({
		group: 'Settings',
		route: {
			label: 'Registration',
			href: `/admin/settings/registration`
		}
	}),
	users: () => ({
		group: 'Settings',
		route: {
			label: 'Users',
			href: `/admin/settings/users`
		}
	})
}

export const settings_routes_group: Routes = [
	{
		label: 'Settings',
		icon: { icon: 'settings', set: 'tabler' },
		href: '/admin/settings',
		subpaths: []
	}
]
