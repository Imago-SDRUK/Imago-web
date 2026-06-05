// import type { MastodonFollowRequest } from '$lib/types/mastodon.js'
// import { createHeaders, getIncomingActorInformation } from '$lib/utils/mastodon'
// import { jstr } from '@arturoguzman/art-ui'
import { json } from '@sveltejs/kit'
// import { env } from '$env/dynamic/private'
// import { createItem, deleteItem } from '@directus/sdk'
// import { directusSDKWithToken, handleDirectusError } from '$lib/utils/directus.js'
// import slugify from '@sindresorhus/slugify'

// const hostname = env.MASTODON_HOSTNAME
// const endpoint = `https://${hostname}`
// const user = env.MASTODON_USER

export async function POST() {
	return json({ message: 'ok' })
}
