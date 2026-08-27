import type { Page } from '$lib/types/directus/index.js'
import { readItems } from '@directus/sdk'
import { error } from '@sveltejs/kit'

export const load = async ({ locals, params }) => {
	const page = await locals.directus.request(
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
								{
									left_column: [
										{
											blocks_id: [
												'*',
												{
													media: [{ directus_files_id: ['*'] }],
													external_assets: [{ external_assets_id: ['*'] }]
												}
											]
										}
									]
								},
								{
									right_column: [
										{
											blocks_id: [
												'*',
												{
													media: [{ directus_files_id: ['*'] }],
													external_assets: [{ external_assets_id: ['*'] }]
												}
											]
										}
									]
								},
								{
									content: [
										{
											blocks_id: [
												'*',
												{
													media: [{ directus_files_id: ['*'] }],
													external_assets: [{ external_assets_id: ['*'] }]
												}
											]
										}
									]
								}
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
	if (page.length === 0) {
		return error(404, { message: 'Not found', id: 'not-found' })
	}
	return {
		page_data: page as Page[]
	}
}
