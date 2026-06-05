import type { MastodonFollowRequest } from '$lib/types/mastodon.js'
import { jstr } from '@arturoguzman/art-ui'
import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { createItem, deleteItem } from '@directus/sdk'
import { directusSDKWithToken, handleDirectusError } from '$lib/utils/directus.js'
import slugify from '@sindresorhus/slugify'
import { getIncomingActorInformation } from '$lib/mastodon/actor/read.js'
import { createHeadersPostRequest } from '$lib/mastodon/signature/headers.js'

const hostname = env.MASTODON_HOSTNAME
const endpoint = `https://${hostname}`
const user = env.MASTODON_USER

export async function POST({ request }) {
	//NOTE: make this internal only
	const data = (await request.json()) as MastodonFollowRequest
	const [actor_errors, actor] = await getIncomingActorInformation({
		actor: data.actor,
		endpoint,
		fetch,
		user,
		url: data.actor
	})

	if (actor_errors !== null) {
		error(500, { message: actor_errors.reason, id: actor_errors.reason })
	}
	const directus = directusSDKWithToken(env.BACKEND_TOKEN, fetch)
	const new_follower = await directus
		.request(
			createItem('mastodon_followers', {
				id: slugify(actor.id),
				actor_id: actor.id,
				actor: actor,
				following: false,
				public_key: actor.publicKey.publicKeyPem
			})
		)
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
	const follow_response = await fetch(actor.inbox, {
		method: 'POST',
		headers,
		body: JSON.stringify(payload)
	}).catch((err) => {
		console.log(jstr(err))
		error(400, { message: `There has been an error posting this request`, id: '' })
	})
	if (follow_response.status !== 202) {
		console.log(`there has been an error, removing follow`)
		await directus
			.request(deleteItem('mastodon_followers', new_follower.id))
			.catch(handleDirectusError)
	}

	return json({ message: 'ok' })
}
