import { env } from '$env/dynamic/private'
import { ADMIN_ROUTES, ROUTES } from '$lib/globals/routes'
import { COOKIES } from '$lib/globals/server.js'
import { userGetGroupsController } from '$lib/server/interface/adapters/controllers/users/get.js'
import { error } from '@sveltejs/kit'
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
	const [errors, users_groups] = await userGetGroupsController({
		configuration: locals.configuration,
		session
	})
	if (errors !== null) {
		error(500, { message: errors.reason, id: errors.reason })
	}
	if (users_groups.find((group) => group.group === 'Admin')) {
		routes.push(ADMIN_ROUTES)
	}
	routes.push({
		label: `Hello, ${locals.session?.identity.first_name}`,
		href: '/user/account',
		subpaths: [
			{ label: 'Account', href: '/user/account' },
			{ label: 'Logout', href: '/auth/logout' }
		]
	})

	return {
		routes,
		session,
		expire,
		allow_debug
	}
}
