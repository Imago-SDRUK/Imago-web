import { env } from '$env/dynamic/private'
import { generateNote } from '$lib/mastodon/notes/create.js'
import { handleDirectusError } from '$lib/utils/directus.js'
import { getArticleDescription } from '$lib/utils/directus/articles.js'
import { readItem } from '@directus/sdk'
import { json } from '@sveltejs/kit'

const hostname = env.MASTODON_HOSTNAME
const endpoint = `https://${hostname}`
const user = env.MASTODON_USER

export const GET = async ({ params, locals }) => {
	const article = await locals.directus
		.request(readItem('articles', params.id, { filter: { status: { _eq: 'published' } } }))
		.catch(handleDirectusError)
	const content = getArticleDescription(article)
	const note = generateNote({
		id: article.id,
		content,
		user: user,
		endpoint,
		hostname,
		published: String(article.date_created)
	})
	return json(note, { headers: { 'Content-Type': 'application/activity+json' } })
}
