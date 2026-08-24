import { env } from '$env/dynamic/private'
import type { Page } from '$lib/types/directus/index.js'
import { handleDirectusError } from '$lib/utils/directus.js'
import { EMAIL_REGEX } from '$lib/utils/regex.js'
import { createItem, readItems } from '@directus/sdk'
import { fail } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	const page = locals.directus.request(
		readItems('pages', {
			fields: [
				'title',
				'type',
				'slug',
				'status',
				{
					sections: [
						'*',
						{
							sections_id: [
								'title',
								'status',
								'subtitle',
								'description',
								'design',
								'columns',
								{ left_column: [{ blocks_id: ['*', { media: [{ directus_files_id: ['*'] }] }] }] },
								{ right_column: [{ blocks_id: ['*', { media: [{ directus_files_id: ['*'] }] }] }] },
								{ content: [{ blocks_id: ['*', { media: [{ directus_files_id: ['*'] }] }] }] }
							]
						}
					]
				}
			],
			filter: {
				_and: [
					{
						status: {
							_eq: 'published'
						}
					},
					{
						type: {
							_eq: 'home'
						}
					}
				]
			}
		})
	)
	return {
		page: (await page) as Page[],
		team_members: await locals.directus
			.request(readItems('team_members'))
			.catch(handleDirectusError),
		careers: await locals.directus.request(readItems('careers')).catch(handleDirectusError),
		events: await locals.directus.request(readItems('events')).catch(handleDirectusError)
	}
}

export const actions = {
	newsletter: async ({ locals, request }) => {
		const form = await request.formData()
		console.log(form)
		const name = form.get('name')
		const email = form.get('email')
		const token = form.get('cf-turnstile-response') as string
		if (!email) return fail(400, { message: `You need to provide an email.` })
		if (EMAIL_REGEX.test(String(email)) === false)
			return fail(400, { message: `You need to provide a valid email.` })
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				secret: env.CF_TURNSTILE_SECRET_KEY,
				response: token
			})
		})
		const captcha = (await response.json()) as { success: boolean }
		if (!captcha.success) {
			return fail(400, { message: `Please try again.` })
		}
		const formatted_name = name?.toString().split(' ')
		await locals.directus
			.request(
				createItem('contacts', {
					email: String(email),
					first_name: Array.isArray(formatted_name) ? formatted_name[0] : formatted_name,
					last_name: Array.isArray(formatted_name) ? formatted_name[1] : null
				})
			)
			.catch(handleDirectusError)
		return {
			message: `You've been added to the Newsletter!`
		}
	}
}
