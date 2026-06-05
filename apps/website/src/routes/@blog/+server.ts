import { env } from '$env/dynamic/private'
import { loadMastodonPublicKey } from '$lib/mastodon/signature/key'
import { json } from '@sveltejs/kit'

const hostname = env.MASTODON_HOSTNAME
const endpoint = `https://${hostname}`
const user = env.MASTODON_USER
export const GET = async () => {
	const value = {
		'@context': 'https://www.w3.org/ns/activitystreams',
		id: `${endpoint}/@${user}`,
		type: 'Person',
		following: `${endpoint}/users/${user}/following`,
		followers: `${endpoint}/users/${user}/followers`,
		inbox: `${endpoint}/users/${user}/inbox`,
		outbox: `${endpoint}/users/${user}/outbox`,
		preferredUsername: 'blog',
		name: 'Imago blog',
		summary: 'Imago blog',
		url: `${endpoint}/`,
		// manuallyApprovesFollowers: false,
		discoverable: true,
		memorial: false,
		icon: {
			type: 'Image',
			mediaType: 'image/png',
			url: `${endpoint}/favicon.png`
		},
		image: {
			type: 'Image',
			mediaType: 'image/png',
			url: `${endpoint}/favicon.png`
		},
		published: '2025-03-31T00:00:00Z',
		// devices: `${endpoint}/@blog/collections/devices`,
		publicKey: {
			'@context': 'https://w3id.org/security/v1',
			'@type': 'Key',
			id: `${endpoint}/@blog#main-key`,
			owner: `${endpoint}/@blog`,
			publicKeyPem: loadMastodonPublicKey()
		},
		tag: [],
		attachment: []
		// endpoints: { sharedInbox: `${endpoint}/inbox` }
	}
	return json(value, { headers: { 'Content-Type': 'application/activity+json' } })
}
