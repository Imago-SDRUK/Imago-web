import { questionUpdateSortController } from '$lib/server/interface/adapters/controllers/questions/update'
import { error, json } from '@sveltejs/kit'

export const POST = async ({ locals, request, params }) => {
	const payload = (await request.json()) as { sort: string }
	const [errors, question] = await questionUpdateSortController({
		session: locals.session,
		configuration: locals.configuration,
		sort: payload.sort,
		id: params.id
	})
	if (errors !== null) {
		error(500, { message: errors?.message ?? errors.reason, id: errors.reason })
	}
	return json({ question })
}
