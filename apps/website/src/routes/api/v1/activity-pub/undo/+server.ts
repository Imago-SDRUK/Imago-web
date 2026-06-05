import type { MastodonUnfollowRequest } from '$lib/types/mastodon.js'
import { jstr } from '@arturoguzman/art-ui'
import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { deleteItem } from '@directus/sdk'
import { directusSDKWithToken, handleDirectusError } from '$lib/utils/directus.js'
import slugify from '@sindresorhus/slugify'
import { getIncomingActorInformation } from '$lib/mastodon/actor/read.js'
import { createHeadersPostRequest } from '$lib/mastodon/signature/headers.js'

const hostname = env.MASTODON_HOSTNAME
const endpoint = `https://${hostname}`
const user = env.MASTODON_USER

export async function POST({ request }) {
	//NOTE: make this internal only
	const data = (await request.json()) as MastodonUnfollowRequest
	const [actor_errors, actor] = await getIncomingActorInformation({
		actor: data.actor,
		fetch,
		endpoint,
		url: data.actor,
		user
	})

	if (actor_errors !== null) {
		error(500, { message: actor_errors.reason, id: actor_errors.reason })
	}

	const directus = directusSDKWithToken(env.BACKEND_TOKEN, fetch)
	await directus
		.request(deleteItem('mastodon_followers', slugify(actor.id)))
		.catch(handleDirectusError)
	const payload = {
		'@context': 'https://www.w3.org/ns/activitystreams',
		id: `${endpoint}/@${user}#accepts/follows/${new URL(actor.url).hostname}@${actor.name}`,
		type: 'Accept',
		actor: `${endpoint}/@${user}`,
		object: data
	}
	const [headers_errors, headers] = createHeadersPostRequest({ payload, endpoint, user })
	if (headers_errors !== null) {
		error(500, { message: headers_errors.reason, id: headers_errors.reason })
	}
	const unfollow_response = await fetch(actor.inbox, {
		method: 'POST',
		headers,
		body: JSON.stringify(payload)
	}).catch((err) => {
		console.log(jstr(err))
		error(400, { message: `There has been an error posting this request`, id: '' })
	})
	if (unfollow_response.status !== 202) {
		console.log(`there has been an error, removing follow`)
	}
	return json({ message: 'ok' })
}
