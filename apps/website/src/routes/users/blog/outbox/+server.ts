import { env } from '$env/dynamic/private'
import { generateNote } from '$lib/mastodon/notes/create.js'
import { generateOutbox } from '$lib/mastodon/outbox/create.js'
import { handleDirectusError } from '$lib/utils/directus.js'
import { getArticleDescription } from '$lib/utils/directus/articles.js'
import { readItems } from '@directus/sdk'
import { json } from '@sveltejs/kit'

const hostname = env.MASTODON_HOSTNAME
const endpoint = `https://${hostname}`
const user = env.MASTODON_USER

export const GET = async ({ locals }) => {
	const notes = await locals.directus
		.request(readItems('articles', { filter: { status: { _eq: 'published' } } }))
		.catch(handleDirectusError)
		.then((articles) =>
			articles.map((article) =>
				generateNote({
					id: article.id,
					content: getArticleDescription(article),
					endpoint,
					hostname,
					user,
					published: String(article.date_created)
				})
			)
		)
	const data = generateOutbox({ endpoint, hostname, user, notes })
	return json(data, { headers: { 'Content-Type': 'application/activity+json' } })
}
