import type { MastodonActor, MastodonBroadcastNote, MastodonItem } from '$lib/types/mastodon.js'
import { jstr } from '@arturoguzman/art-ui'
import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { readItems } from '@directus/sdk'
import { directusSDKWithToken, handleDirectusError } from '$lib/utils/directus.js'
import { DateTime } from 'luxon'
import { generateDigitalSignature } from '$lib/mastodon/signature/create.js'
import { getIncomingActorInformation } from '$lib/mastodon/actor/read.js'
import { type ErrTypes } from '$lib/utils/errors.js'
import { createHeadersPostRequest } from '$lib/mastodon/signature/headers.js'

const hostname = env.MASTODON_HOSTNAME
const endpoint = `https://${hostname}`
const user = env.MASTODON_USER

export async function GET({ params, fetch }) {
	//NOTE: make this internal only
	const article_res = await fetch(`${endpoint}/users/${user}/statuses/${params.id}`)
	const article = (await article_res.json()) as MastodonItem
	const date_time = DateTime.now().toHTTP()
	const payload: MastodonBroadcastNote = {
		'@context': 'https://www.w3.org/ns/activitystreams',
		id: `${endpoint}/users/${user}/statuses/${params.id}/activity`,
		type: 'Create',
		actor: `${endpoint}/@${user}`,
		to: ['https://www.w3.org/ns/activitystreams#Public'],
		cc: [`${endpoint}/users/${user}/followers`, `${endpoint}/@${user}`],
		published: date_time,
		object: article,
		signature: {
			type: 'RsaSignature2017',
			creator: `${endpoint}/users/${user}#main-key`,
			created: date_time,
			signatureValue: generateDigitalSignature(JSON.stringify(article))
		}
	}
	const directus = directusSDKWithToken(env.BACKEND_TOKEN, fetch)
	const followers = await directus
		.request(readItems('mastodon_followers'))
		.catch(handleDirectusError)
	const actors = await Promise.allSettled(
		followers.map((follower) =>
			getIncomingActorInformation({
				actor: String(follower.actor_id),
				fetch,
				endpoint,
				user,
				url: String(follower.actor_id)
			})
		)
	).then((results) =>
		results.reduce(
			(acc, el) => {
				if (el.status === 'fulfilled') {
					const [errors, data] = el.value
					if (errors !== null) {
						acc.errors.push(errors)
						return acc
					}
					acc.data.push(data)
				}
				if (el.status === 'rejected') {
					acc.errors.push({ reason: 'Unexpected', error: el.reason })
				}
				return acc
			},
			{ data: [], errors: [] } as { data: MastodonActor[]; errors: ErrTypes[] }
		)
	)
	for (const error of actors.errors) {
		console.log(`There has been an error publishing to ${jstr(error)}`)
	}
	for (const actor of actors.data) {
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
	}
	return json({ message: 'ok' })
}
