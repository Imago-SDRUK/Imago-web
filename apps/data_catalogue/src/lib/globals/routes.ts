import { env } from '$env/dynamic/public'
import type { Routes } from '@imago/ui'

export const ROUTES: Routes = [
	{
		label: 'Home',
		href: '/',
		subpaths: [
			{
				label: 'Imago',
				href: env.PUBLIC_IMAGO_URL ?? 'http://127.0.0.1:5173'
			},
			{
				label: 'Data catalogue',
				href: env.PUBLIC_IMAGO_DATA_CATALOGUE_URL ?? 'http://127.0.0.1:5174'
			}
		]
	},
	{
		label: 'Datasets',
		href: '/datasets',
		subpaths: []
	},

	{
		label: 'Playground',
		href: '/playground',
		subpaths: []
	}
	// {
	// 	label: 'Topics',
	// 	href: '/topics',
	// 	subpaths: [
	// 		{
	// 			label: 'SRF',
	// 			href: '/topics/srf'
	// 		}
	// 	]
	// },
	// { label: 'Login', href: '/auth/login', subpaths: [] }
]

export const ADMIN_ROUTES = {
	label: 'Admin',
	href: '/admin/settings',
	subpaths: [
		{ label: 'Datasets', href: '/admin/settings/datasets' },
		{ label: 'Groups', href: '/admin/settings/groups' },
		{ label: 'Permissions', href: '/admin/settings/permissions' },
		{ label: 'Registration', href: '/admin/settings/registration' },
		{ label: 'Users', href: '/admin/settings/users' }
	]
}
