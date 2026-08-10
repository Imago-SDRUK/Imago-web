import type { Page } from '$lib/types/directus/index.js'
import { readItems } from '@directus/sdk'

export const load = async ({ locals, params }) => {
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
						slug: {
							_eq: params.slug
						}
					}
				]
			}
		})
	)
	return {
		page_data: (await page) as Page[]
	}
}
