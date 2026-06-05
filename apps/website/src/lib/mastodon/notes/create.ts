import type { MastodonItem } from '$lib/types/mastodon'

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
