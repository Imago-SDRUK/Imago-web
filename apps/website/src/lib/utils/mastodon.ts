import { env } from '$env/dynamic/private'
import type {
	MastodonActor,
	MastodonItem,
	MastodonPayload,
	MastodonRequest
} from '$lib/types/mastodon'
import { jstr } from '@arturoguzman/art-ui'
import { error } from '@sveltejs/kit'
import { DateTime } from 'luxon'
import { createHash, createSign, createVerify, constants, verify } from 'node:crypto'

const hostname = env.MASTODON_HOSTNAME
const endpoint = `https://${hostname}`
const user = env.MASTODON_USER

export const content_type_headers = `application/activity+json, application/activity+ld`

export const loadKey = (key: string) => Buffer.from(key, 'base64').toString().trim()

export function hashSHA256(data: string) {
	return createHash('sha256').update(data).digest('base64')
}

export function generateDigitalSignature(data: string): string {
	const private_key = loadKey(env.RSA_PRIVATE_KEY)
	const sign = createSign('RSA-SHA256')
	sign.update(data)
	const result = sign.sign(
		{
			key: private_key,
			padding: constants.RSA_PKCS1_PADDING
		},
		'base64'
	)
	return result
}

export function validateDigitalSignature(
	data: string,
	receivedSignature: string,
	key = loadKey(env.RSA_PUBLIC_KEY)
): boolean {
	const verify = createVerify('RSA-SHA256')
	verify.update(data)
	return verify.verify(key, receivedSignature, 'base64')
}

export function validateMastodonSignature(
	signature_string: string,
	receivedSignature: string,
	key: string | undefined = env.RSA_PUBLIC_KEY
): boolean {
	console.log(`checking ${signature_string}`)
	console.log(`agains ${receivedSignature}`)
	const result = verify(
		'sha256',
		Buffer.from(signature_string),
		{
			key: key,
			padding: constants.RSA_PKCS1_PADDING
		},
		Buffer.from(receivedSignature, 'base64')
	)
	return result
}

function buildSignatureString(req: Request, headerList: string[]) {
	return headerList
		.map((header) => {
			if (header === '(request-target)') {
				return `${header}: ${req.method.toLowerCase()} ${new URL(req.url).pathname}`
			}
			const value = req.headers.get(header.toLowerCase())
			if (!value) throw new Error(`Missing header: ${header}`)
			return `${header}: ${value}`
		})
		.join('\n')
}

export const verifyMastodonRequest = async (
	request: Request,
	fetch: typeof globalThis.fetch
): Promise<{ data: MastodonRequest; valid: boolean }> => {
	const data = (await request.json().catch((err) => {
		console.log(err)
		error(400, { message: `This is not a valid request`, id: '' })
	})) as MastodonRequest
	const signature_header = request.headers.get('signature')
	if (!signature_header) error(401, { message: `You're not authorised to do this`, id: '' })
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
		error(401, { message: `You're not authorised to do this`, id: '' })
	}
	const enriched_actor = await getIncomingActorInformation({
		url: signature_params.keyId,
		actor: 'actor' in data ? data.actor : data.id,
		endpoint,
		fetch,
		user
	})
	console.log(jstr(enriched_actor))
	const public_key = enriched_actor.publicKey.publicKeyPem
	const built_signature_string = buildSignatureString(request, signature_params.headers.split(' '))
	const verified = validateDigitalSignature(
		built_signature_string,
		signature_params.signature,
		public_key
	)
	if (!verified) {
		error(401, { message: `You're not authorised to do this`, id: '' })
	}
	const digest_header = request.headers.get('digest')
	if (!digest_header) {
		error(401, { message: `You're not authorised to do this`, id: '' })
	}
	const digest = createHash('sha256').update(JSON.stringify(data)).digest('base64')

	if (digest_header !== `SHA-256=${digest}`) {
		error(401, { message: `You're not authorised to do this`, id: '' })
	}
	return {
		data,
		valid: true
	}
}

export const generateNote = ({
	id,
	content,
	endpoint,
	user,
	hostname,
	published
}: {
	id: string
	content: string
	user: string
	endpoint: string
	hostname: string
	published: string
}): MastodonItem => ({
	'@context': [
		'https://www.w3.org/ns/activitystreams',
		{
			ostatus: 'http://ostatus.org#',
			atomUri: 'ostatus:atomUri',
			inReplyToAtomUri: 'ostatus:inReplyToAtomUri',
			conversation: 'ostatus:conversation',
			sensitive: 'as:sensitive',
			toot: 'http://joinmastodon.org/ns#',
			votersCount: 'toot:votersCount'
		}
	],
	id: `${endpoint}/users/${user}/statuses/${id}`,
	type: 'Note',
	summary: null,
	inReplyTo: null,
	published: published,
	url: `${endpoint}/@${user}/${id}`,
	attributedTo: `${endpoint}/@${user}`,
	to: ['https://www.w3.org/ns/activitystreams#Public'],
	cc: [`${endpoint}/users/${user}/followers`],
	sensitive: false,
	atomUri: `${endpoint}/users/${user}/statuses/${id}`,
	inReplyToAtomUri: null,
	conversation: `tag:${hostname},2025-03-31:objectId=205339:objectType=Conversation`,
	content: content,
	contentMap: { en: content },
	attachment: [],
	tag: [],
	replies: {
		id: `${endpoint}/users/${user}/statuses/${id}/replies`,
		type: 'Collection',
		first: {
			type: 'CollectionPage',
			next: `${endpoint}/users/${user}/statuses/${id}/replies?only_other_accounts=true\u0026page=true`,
			partOf: `${endpoint}/users/${user}/statuses/${id}/replies`,
			items: []
		}
	},
	likes: {
		id: `${endpoint}/users/${user}/statuses/${id}/likes`,
		type: 'Collection',
		totalItems: 0
	},
	shares: {
		id: `${endpoint}/users/${user}/statuses/${id}/shares`,
		type: 'Collection',
		totalItems: 0
	}
})

export const generateStatus = ({
	id,
	content,
	endpoint,
	user,
	hostname
}: {
	id: string
	content: string
	user: string
	endpoint: string
	hostname: string
}): MastodonItem => ({
	'@context': [
		'https://www.w3.org/ns/activitystreams',
		{
			ostatus: 'http://ostatus.org#',
			atomUri: 'ostatus:atomUri',
			inReplyToAtomUri: 'ostatus:inReplyToAtomUri',
			conversation: 'ostatus:conversation',
			sensitive: 'as:sensitive',
			toot: 'http://joinmastodon.org/ns#',
			votersCount: 'toot:votersCount'
		}
	],
	id: `${endpoint}/users/${user}/statuses/${id}`,
	type: 'Note',
	summary: null,
	inReplyTo: null,
	published: '2025-03-31T14:44:05Z',
	url: `${endpoint}/@${user}/${id}`,
	attributedTo: `${endpoint}/users/${user}`,
	to: ['https://www.w3.org/ns/activitystreams#Public'],
	cc: [`${endpoint}/users/${user}/followers`],
	sensitive: false,
	atomUri: `${endpoint}/users/${user}/statuses/${id}`,
	inReplyToAtomUri: null,
	conversation: `tag:${hostname},2025-03-31:objectId=205339:objectType=Conversation`,
	content: content,
	contentMap: { en: content },
	attachment: [],
	tag: [],
	replies: {
		id: `${endpoint}/users/${user}/statuses/${id}/replies`,
		type: 'Collection',
		first: {
			type: 'CollectionPage',
			next: `${endpoint}/users/${user}/statuses/${id}/replies?only_other_accounts=true\u0026page=true`,
			partOf: `${endpoint}/users/${user}/statuses/${id}/replies`,
			items: []
		}
	},
	likes: {
		id: `${endpoint}/users/${user}/statuses/${id}/likes`,
		type: 'Collection',
		totalItems: 0
	},
	shares: {
		id: `${endpoint}/users/${user}/statuses/${id}/shares`,
		type: 'Collection',
		totalItems: 0
	}
})

export const generateReply = ({
	id,
	content,
	endpoint,
	user,
	hostname
}: {
	id: string
	content: string
	user: string
	endpoint: string
	hostname: string
}): MastodonItem => ({
	'@context': [
		'https://www.w3.org/ns/activitystreams',
		{
			ostatus: 'http://ostatus.org#',
			atomUri: 'ostatus:atomUri',
			inReplyToAtomUri: 'ostatus:inReplyToAtomUri',
			conversation: 'ostatus:conversation',
			sensitive: 'as:sensitive',
			toot: 'http://joinmastodon.org/ns#',
			votersCount: 'toot:votersCount'
		}
	],
	id: `${endpoint}/users/${user}/statuses/${id}`,
	type: 'Note',
	summary: null,
	inReplyTo: null,
	published: '2025-03-31T14:44:05Z',
	url: `${endpoint}/@${user}/${id}`,
	attributedTo: `${endpoint}/users/${user}`,
	to: ['https://www.w3.org/ns/activitystreams#Public'],
	cc: [`${endpoint}/users/${user}/followers`],
	sensitive: false,
	atomUri: `${endpoint}/users/${user}/statuses/${id}`,
	inReplyToAtomUri: null,
	conversation: `tag:${hostname},2025-03-31:objectId=205339:objectType=Conversation`,
	content: content,
	contentMap: { en: content },
	attachment: [],
	tag: [],
	replies: {
		id: `${endpoint}/users/${user}/statuses/${id}/replies`,
		type: 'Collection',
		first: {
			type: 'CollectionPage',
			next: `${endpoint}/users/${user}/statuses/${id}/replies?only_other_accounts=true\u0026page=true`,
			partOf: `${endpoint}/users/${user}/statuses/${id}/replies`,
			items: []
		}
	},
	likes: {
		id: `${endpoint}/users/${user}/statuses/${id}/likes`,
		type: 'Collection',
		totalItems: 0
	},
	shares: {
		id: `${endpoint}/users/${user}/statuses/${id}/shares`,
		type: 'Collection',
		totalItems: 0
	}
})

export const generateOutbox = ({
	endpoint,
	user,
	notes
}: {
	hostname: string
	endpoint: string
	user: string
	notes?: MastodonItem[]
}) => ({
	'@context': 'https://www.w3.org/ns/activitystreams',
	id: `${endpoint}/users/${user}/outbox`,
	type: 'OrderedCollection',
	totalItems: notes?.length ?? 0,
	first: `${endpoint}/users/${user}/outbox?page=true`,
	last: `${endpoint}/users/${user}/outbox?min_id=0\u0026page=true`,
	orderedItems: notes
})

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
}) => {
	const signed_actor_request_headers = createHeadersGetRequest({
		endpoint,
		user,
		actor
	})
	const res_actor = await fetch(url, {
		headers: signed_actor_request_headers
	}).catch((err) => {
		console.log(err)
		error(400, { message: `Couldn't get the actor information`, id: '' })
	})
	const result = await res_actor.json()
	if ('error' in result || res_actor.status > 399) {
		console.log(result)
		console.log(res_actor.status)
		error(400, { message: `Couldn't get the actor information`, id: '' })
	}
	return result as MastodonActor
}
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
	console.log(`RECEIVED ACTOR, ${jstr(actor)}`)
	const date_header = DateTime.now().toHTTP()
	const to_sign = [
		`(request-target): get ${new URL(actor).pathname}`,
		`host: ${host_header}`,
		`date: ${date_header}`
	].join('\n')
	console.log(`TO SIGN REQUEST ${to_sign}`)
	const signature_header = generateDigitalSignature(to_sign)
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

export const createHeaders = ({
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
	if (!object)
		error(500, {
			message: `Payload object must be defined to sign this request`,
			id: 'missing-actor'
		})
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
	return headers
}
