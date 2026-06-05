import { verifyMastodonRequest } from '$lib/mastodon/signature/index.js'
import { error, json } from '@sveltejs/kit'

export const GET = async ({ request, fetch }) => {
	const valid = await verifyMastodonRequest(request, fetch)
	return json(valid)
}

export const POST = async ({ request, fetch }) => {
	try {
		const [data_error, data] = await verifyMastodonRequest(request, fetch)
		if (data_error !== null) {
			error(500, { message: data_error.reason, id: data_error.reason })
		}
		fetch(`/api/v1/activity-pub/${data.type.toLowerCase()}`, {
			method: 'POST',
			body: JSON.stringify(data)
		})
		return json(
			{ message: 'ok' },
			{
				headers: {
					'Content-Type': 'accept:application/activity+json'
				}
			}
		)
	} catch (err) {
		console.log(err)
		error(500, { message: 'Unexpected', id: 'err' })
	}
}
