import type { MastodonActor } from '$lib/types/mastodon'
import { createHeadersGetRequest } from '$lib/mastodon/signature/headers'
import { err, ok, type ErrTypes } from '$lib/utils/errors'

export const getIncomingActorInformation = async ({
	url,
	fetch,
	endpoint,
	user,
	actor
}: {
	url: string
	fetch: typeof globalThis.fetch
	endpoint: string
	user: string
	actor: string
}): Promise<[ErrTypes, null] | [null, MastodonActor]> => {
	const signed_actor_request_headers = createHeadersGetRequest({
		endpoint,
		user,
		actor
	})
	return await fetch(url, {
		headers: signed_actor_request_headers
	})
		.then(async (res) => {
			const data = await res.json()
			if (res.status > 399) {
				return err({ reason: 'Not Found', message: `Couldn't get the actor information` })
			}
			return ok(data as MastodonActor)
		})
		.catch((error) => {
			console.log(error)
			return err({ reason: 'Not Found', message: `Couldn't get the actor information` })
		})
}
