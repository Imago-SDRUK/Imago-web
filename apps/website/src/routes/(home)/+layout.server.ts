import { readItems } from '@directus/sdk'
import type { Route } from '@imago/ui'

export const load = async ({ locals }) => {
	const pages = await locals.directus.request(readItems('pages'))
	const nav_pages: Route[] = pages
		.filter((page) => page.type === 'general')
		.map((page) => ({ href: page.slug, label: page.title ?? page.slug }))
	const footer_pages: Route[] = pages
		.filter((page) => page.type === 'footer')
		.map((page) => ({ href: page.slug, label: page.title ?? page.slug }))
	return {
		nav_pages,
		footer_pages
	}
}
// https://svelte.dev/docs/kit/load#Layout-data
