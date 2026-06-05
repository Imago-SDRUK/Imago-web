import { generateDigitalSignature } from '$lib/mastodon/signature/create'
import { hashSHA256 } from '$lib/mastodon/signature/hash'
import type { MastodonActor, MastodonPayload } from '$lib/types/mastodon'
import { err, ok } from '$lib/utils/errors'
import { DateTime } from 'luxon'

export const createHeadersGetRequest = ({
	endpoint,
	user,
	actor
}: {
	endpoint: string
	user: string
	actor: string
}) => {
	const host_header = new URL(actor).hostname
	const date_header = DateTime.now().toHTTP()
	const to_sign = [
		`(request-target): get ${new URL(actor).pathname}`,
		`host: ${host_header}`,
		`date: ${date_header}`
	].join('\n')
	const signature_header = generateDigitalSignature(to_sign)

	//TODO: evaluate format of users with regex
	const signature_params = {
		key_id: `${endpoint}${user.startsWith('/') ? user : `/@${user}`}#main-key`,
		algorithm: 'rsa-sha256',
		headers: '(request-target) host date',
		signature: signature_header
	}
	const headers = {
		Accept: 'application/activity+json',
		Host: host_header,
		Date: date_header,
		Signature: [
			`keyId="${signature_params.key_id}"`,
			`algorithm="${signature_params.algorithm}"`,
			`headers="${signature_params.headers}"`,
			`signature="${signature_header}"`
		].join(',')
	}
	return headers
}

export const createHeadersPostRequest = ({
	payload,
	endpoint,
	user,
	actor
}: {
	endpoint: string
	user: string
	payload: MastodonPayload
	actor?: MastodonActor
}) => {
	const object = payload.object
	if (!object) {
		return err({
			reason: 'Invalid Data',
			message: `Payload object must be defined to sign this request`,
			id: 'missing-actor'
		})
	}
	const payload_hash = hashSHA256(JSON.stringify(payload))
	const host_header = actor
		? new URL(actor.id).hostname
		: new URL('actor' in object ? object.actor : object.id).hostname
	const date_header = DateTime.now().toHTTP()
	const digest_header = `SHA-256=${payload_hash}`
	const to_sign = [
		`(request-target): post ${actor ? new URL(actor.id).pathname : new URL('actor' in object ? object.actor : object.id).pathname}/inbox`,
		`host: ${host_header}`,
		`date: ${date_header}`,
		`digest: ${digest_header}`
	].join('\n')
	const signature_header = generateDigitalSignature(to_sign)
	const signature_params = {
		key_id: `${endpoint}/@${user}#main-key`,
		algorithm: 'rsa-sha256',
		headers: '(request-target) host date digest',
		signature: signature_header
	}
	const headers = {
		Host: host_header,
		Date: date_header,
		Digest: digest_header,
		Signature: [
			`keyId="${signature_params.key_id}"`,
			`algorithm="${signature_params.algorithm}"`,
			`headers="${signature_params.headers}"`,
			`signature="${signature_header}"`
		].join(','),
		Algorithm: 'rsa-sha256',
		'Content-Type':
			'application/activity+json; application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
	}
	return ok(headers)
}
