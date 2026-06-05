import type { MastodonFollowRequest } from '$lib/types/mastodon.js'
import { jstr } from '@arturoguzman/art-ui'
import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { createHeadersPostRequest } from '$lib/mastodon/signature/headers.js'
import { getIncomingActorInformation } from '$lib/mastodon/actor/read.js'

const hostname = env.MASTODON_HOSTNAME
const endpoint = `https://${hostname}`
const user = env.MASTODON_USER

export async function POST({ request }) {
	const data = (await request.json()) as MastodonFollowRequest
	const [actor_errors, actor] = await getIncomingActorInformation({
		actor: data.actor,
		endpoint,
		user,
		fetch,
		url: data.actor
	})
	if (actor_errors !== null) {
		error(500, { message: actor_errors.reason, id: actor_errors.reason })
	}
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
	await fetch(actor.inbox, {
		method: 'POST',
		headers,
		body: JSON.stringify(payload)
	}).catch((err) => {
		console.log(jstr(err))
		error(400, { message: `There has been an error posting this request`, id: '' })
	})
	return json({ message: 'ok' })
}
