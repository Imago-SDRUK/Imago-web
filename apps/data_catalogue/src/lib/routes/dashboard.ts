import type { Routes, Tab } from '@imago/ui'
type NavigationFeatures = 'dashboard' | 'new_dashboard'

export const dashboard_routes: Record<
	NavigationFeatures,
	({ id }: { id?: string }) => { group: string; route: Tab }
> = {
	dashboard: () => ({
		group: 'Dashboard',
		route: {
			label: 'Dashboard',
			href: `/admin/dashboard`
		}
	}),

	new_dashboard: () => ({
		group: 'Dashboard',
		route: {
			label: 'Engagement Insights',
			href: `/admin/insights`
		}
	})
}

export const dashboard_routes_group: Routes = [
	{
		label: 'Dashboard',
		icon: { icon: 'building', set: 'tabler' },
		subpaths: [],
		href: '/admin/dashboard'
	},
	{
		label: 'New Dashboard',
		icon: { icon: 'building', set: 'tabler' },
		subpaths: [],
		href: '/admin/new_dashboard'
	},
]
