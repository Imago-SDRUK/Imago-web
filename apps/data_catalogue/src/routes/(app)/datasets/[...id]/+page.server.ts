import {
	datasetGetActivityController,
	datasetGetController
} from '$lib/server/interface/adapters/controllers/datasets/get.js'
import { error } from '@sveltejs/kit'

export const load = async ({ locals, params }) => {
	const [errs, dataset] = await datasetGetController({ id: params.id, session: locals.session })
	if (errs !== null) {
		error(400, { message: `There's been an error retreiving this dataset`, id: '' })
	}

	if (dataset === null) {
		error(400, { message: `There's been an error retreiving this dataset`, id: '' })
	}
	const [errors, activities] = await datasetGetActivityController({
		id: params.id,
		session: locals.session
	})
	if (errors !== null) {
		error(400, { message: errors.reason, id: errors.reason })
	}
	return {
		dataset,
		activities
	}
}
