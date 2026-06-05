import type { MastodonItem } from '$lib/types/mastodon'

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
