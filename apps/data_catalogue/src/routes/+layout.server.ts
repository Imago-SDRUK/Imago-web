import { env } from '$env/dynamic/private'
import { ROUTES } from '$lib/globals/routes'
import { COOKIES } from '$lib/globals/server.js'
import { dashboard_routes, dashboard_routes_group } from '$lib/routes/dashboard.js'
import { getNavigation } from '$lib/routes/index.js'
import { settings_routes, settings_routes_group } from '$lib/routes/settings.js'
export const load = async ({ locals, cookies }) => {
	const allow_debug = env.NODE_ENV !== 'production'
	const expire = cookies.get(COOKIES.expire)
	const routes = structuredClone(ROUTES)
	const session = locals.session
	if (!session) {
		routes.push({ label: 'Login', href: '/auth/login', subpaths: [] })
		return {
			routes,
			session,
			expire,
			allow_debug
		}
	}
	if (session.identity.id === 'anonymous') {
		routes.push({ label: 'Login', href: '/auth/login', subpaths: [] })
		return {
			routes,
			session,
			expire,
			allow_debug
		}
	}
	const [dashboard_errors, dashboard] = await getNavigation({
		groups: dashboard_routes_group,
		routes: dashboard_routes,
		configuration: locals.configuration,
		session: locals.session
	})
	const [settings_errors, settings] = await getNavigation({
		groups: settings_routes_group,
		routes: settings_routes,
		configuration: locals.configuration,
		session: locals.session
	})
	const merged = [...routes, ...(dashboard ?? []), ...(settings ?? [])]
	merged.push({
		label: `Hello, ${locals.session?.identity.first_name}`,
		href: '/user/account',
		subpaths: [
			{ label: 'Account', href: '/user/account' },
			{ label: 'Logout', href: '/auth/logout' }
		]
	})
	return {
		routes: merged,
		session,
		expire,
		allow_debug
	}
}
