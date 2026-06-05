import { env } from '$env/dynamic/private'
import { getIncomingActorInformation } from '$lib/mastodon/actor/read'
import { buildSignatureString } from '$lib/mastodon/signature/create'
import { validateDigitalSignature } from '$lib/mastodon/signature/read'
import type { MastodonRequest } from '$lib/types/mastodon'
import { ok, err, type ErrTypes } from '$lib/utils/errors'
import { createHash } from 'node:crypto'

const hostname = env.MASTODON_HOSTNAME
const endpoint = `https://${hostname}`
const user = env.MASTODON_USER

export const content_type_headers = `application/activity+json, application/activity+ld`

export const verifyMastodonRequest = async (
	request: Request,
	fetch: typeof globalThis.fetch
): Promise<[ErrTypes, null] | [null, MastodonRequest]> => {
	const [data_errors, data] = await request
		.json()
		.then((res) => ok(res as MastodonRequest))
		.catch((error) => err({ reason: 'Unexpected', error }))
	if (data_errors !== null) {
		return err(data_errors)
	}
	const signature_header = request.headers.get('signature')
	if (!signature_header) {
		return err({ reason: 'Unauthorised' })
	}
	const signature_params: { keyId: string; algorithm: string; headers: string; signature: string } =
		Object.fromEntries(
			signature_header.split(/,/g).map((p) => p.split(/="/, 2).map((s) => s.replace(/"/g, '')))
		)
	if (
		!signature_params.keyId ||
		!signature_params.algorithm ||
		!signature_params.headers ||
		!signature_params.signature
	) {
		return err({ reason: 'Unauthorised' })
	}
	const [actor_errors, actor] = await getIncomingActorInformation({
		url: signature_params.keyId,
		actor: 'actor' in data ? data.actor : data.id,
		endpoint,
		fetch,
		user
	})
	if (actor_errors !== null) {
		return err(actor_errors)
	}
	const public_key = actor.publicKey.publicKeyPem
	const built_signature_string = buildSignatureString(request, signature_params.headers.split(' '))
	const verified = validateDigitalSignature(
		built_signature_string,
		signature_params.signature,
		public_key
	)
	if (!verified) {
		return err({ reason: 'Unauthorised' })
	}
	const digest_header = request.headers.get('digest')
	if (!digest_header) {
		return err({ reason: 'Unauthorised' })
	}
	const digest = createHash('sha256').update(JSON.stringify(data)).digest('base64')

	if (digest_header !== `SHA-256=${digest}`) {
		return err({ reason: 'Unauthorised' })
	}
	return ok(data)
}
