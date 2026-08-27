import { handleDirectusError } from '$lib/utils/directus.js'
import { env } from '$env/dynamic/private'
import { readItems } from '@directus/sdk'
import type { PageServerLoadEvent } from './$types.js'
export const load = async ({ locals, params }: PageServerLoadEvent) => {
	const article = await locals.directus
		.request(
			readItems('articles', {
				filter:
					env.NODE_ENV === 'development'
						? {
								slug: {
									_eq: params.slug
								}
							}
						: {
								_and: [
									{
										slug: {
											_eq: params.slug
										},
										status: {
											_eq: 'published'
										}
									}
								]
							},
				deep: {
					sections: {
						_filter:
							env.NODE_ENV === 'development'
								? {}
								: {
										article_sections_id: {
											status: {
												_eq: 'published'
											}
										}
									}
					}
				},
				fields: [
					'*',
					{
						sections: [
							{
								article_sections_id: [
									'*',
									{ content: ['*', { media: [{ directus_files_id: ['*'] }] }] }
								]
							}
						]
					},
					{ user_created: ['first_name', 'last_name'] },
					{ media: ['*', { directus_files_id: ['*'] }] }
				]
			})
		)
		.catch(handleDirectusError)
	return {
		article
	}
}
