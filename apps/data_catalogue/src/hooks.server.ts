import * as Sentry from '@sentry/sveltekit'
import { env } from '$env/dynamic/private'
import { createCkanClient } from '$lib/utils/ckan/ckan'
import { getId } from '@arturoguzman/art-ui'
import { error, redirect, type Handle, type HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { COOKIES } from '$lib/globals/server'
import { log } from '$lib/utils/server/logger'

import { runMigration } from '$lib/db/migrate'
import { DateTime } from 'luxon'
// import { createUser } from '$lib/server/application/use_cases/users/user_create'
import { authenticationServiceInfrastructure } from '$lib/server/infrastructure/services/authentication'
import { userGetMeController } from '$lib/server/interface/adapters/controllers/users/get'
import type { ServerInit } from '@sveltejs/kit'
import { configurationGetController } from '$lib/server/interface/adapters/controllers/configuration/get'
// export const crawlers = [
// 	'Googlebot',
// 	'Googlebot-Image',
// 	'Googlebot-News',
// 	'Storebot-Google',
// 	'Google-InspectionTool',
// 	'GoogleOther'
// ]

export const init: ServerInit = async () => {
	log.trace('Initialising')
	if (process.env.BUILD) {
		log.debug('building - skip')
		return
	}
	// if (!env.ACCESS_MODE) {
	// error(500, {
	// id: 'server-error',
	// message: `Sorry, you need to specify an access mode before deploying this website.`
	// })
	// }
	// if (env.NODE_ENV === 'production') {
	// log.info('initialising with the following envs')
	// log.info(env)
	// console.log('hey')
	// throw Error('end')

	await runMigration()
	// }
}

const handleConfiguration: Handle = async ({ event, resolve }) => {
	const [errors, configuration] = await configurationGetController()
	if (event.url.pathname === '/configuration') {
		if (configuration !== null) {
			event.locals.configuration = configuration
			return redirect(307, '/')
		}
		return await resolve(event)
	}
	if (errors !== null) {
		if (errors.reason === 'Not Found') {
			return redirect(307, '/configuration')
		}
		return error(500, {
			message: `There's been an issue initialising the application, are you sure the database is up and running?`,
			id: 'err'
		})
	}
	if (configuration === null) {
		return redirect(307, '/configuration')
	}
	event.locals.configuration = configuration
	return await resolve(event)
}

const handleAccessMode: Handle = async ({ event, resolve }) => {
	event.locals.access = false
	const access_mode = env.ACCESS_MODE
	if (access_mode === 'invite_only') {
		const cookie = event.cookies.get(COOKIES.access_token)
		if (cookie === env.ACESSS_INVITE_ONLY_TOKEN) {
			event.locals.access = true
		}
	}
	if (access_mode === 'authentication') {
		event.locals.access = true
	}
	if (access_mode === 'development') {
		event.locals.access = true
	}
	if (access_mode === 'build') {
		event.locals.access = true
	}

	const preauthorised = event.cookies.get('kratos-api') === env.IDENTITY_TOKEN
	if (preauthorised) {
		event.locals.access = true
		event.locals.identity_token = event.cookies.get('kratos-api')
	}
	if (!event.locals.access && event.url.pathname !== '/access') {
		return new Response(null, {
			status: 307,
			headers: { location: '/access' }
		})
	}
	if (event.locals.access && event.url.pathname === '/access') {
		return new Response(null, {
			status: 307,
			headers: { location: '/' }
		})
	}
	return resolve(event)
}

const handleCkan: Handle = async ({ event, resolve }) => {
	event.locals.ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined,
		fetch: event.fetch
	})
	const connection = await event.locals.ckan.ping()
	if (!connection.success) {
		log.debug(`CKAN is down`)
		error(503, {
			message: `Imago is currently down, please check back later!`,
			id: 'service-unavailable'
		})
	}
	const response = await resolve(event)
	if (!event.url.pathname.includes('/assets')) {
		log.debug({
			pathname: event.url.pathname,
			ip: event.getClientAddress(),
			datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
		})
	}
	return response
}

const handleAuthentication: Handle = async ({ event, resolve }) => {
	event.locals.session = {
		identity: {
			id: 'anonymous',
			first_name: 'anonymous',
			last_name: 'anonymous',
			email: 'anonymous'
		},
		active: true,
		expires_at: '',
		id: 'anonymous',
		verified: true
	}
	const cookie = event.cookies.get('ory_kratos_session')
	const token = event.request.headers.get('authorization')
	if ((cookie || token) && !event.url.pathname.startsWith('/auth/login')) {
		const session = await authenticationServiceInfrastructure.kratos.validateSession({
			cookie,
			token
		})
		if ('session' in session) {
			event.locals.session = session.session
			if (session.session.redirect_browser_to) {
				redirect(303, session.session.redirect_browser_to)
			}
			return resolve(event)
		}
		const { action } = session
		if (action === 'invalidate') {
			event.cookies.delete('ory_kratos_session', { path: '/' })
			event.request.headers.delete('authorization')
			redirect(307, '/auth/login')
		}
		if (action === 'verify' && event.url.pathname !== '/auth/verification') {
			log.debug(`Session is valid but account isnt verified`)
			redirect(307, '/auth/verification')
		}
	}

	return resolve(event)
}

const handleProfile: Handle = async ({ event, resolve }) => {
	if (
		event.locals.session &&
		event.locals.session.identity &&
		event.locals.session.identity.id !== 'anonymous'
	) {
		const [error, profile] = await userGetMeController({
			session: event.locals.session,
			configuration: event.locals.configuration
		})
		if (error !== null) {
			redirect(307, `/user/register`)
		}
		if (profile.status === 'preregister' || profile.status === 'draft') {
			if (event.url.pathname !== '/user/register') {
				log.warn(`redirect user to /user/register as profile exists but status is preregister`)
				redirect(307, `/user/register`)
			}
		}
	}
	return resolve(event)
}

export const hooksErrorHandler: HandleServerError = async ({ event, status, message, error }) => {
	if (status !== 404) {
		log.error({
			error,
			message,
			ip: event.getClientAddress(),
			datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS),
			url: event.url,
			request: event.request
		})
	}
	return {
		id: getId(),
		message: status === 404 ? `This page does not exist!` : 'Whoops!'
		// errorId
	}
}

export const handle =
	process.env.NODE_ENV === 'production'
		? sequence(
				handleConfiguration,
				handleAccessMode,
				Sentry.sentryHandle(),
				handleAuthentication,
				handleProfile,
				handleCkan
			)
		: sequence(
				handleConfiguration,
				handleAccessMode,
				handleAuthentication,
				handleProfile,
				handleCkan
			)
export const handleError =
	process.env.NODE_ENV === 'production'
		? Sentry.handleErrorWithSentry(hooksErrorHandler)
		: hooksErrorHandler
