import { datasetsGetCountController } from '$lib/server/interface/adapters/controllers/datasets/get.js'
import { error } from '@sveltejs/kit'
import { tagsGetCountController } from '$lib/server/interface/adapters/controllers/tags/get.js'
export const load = async () => {
	return {
		package_count: await datasetsGetCountController().then(([errors, count]) => {
			if (errors !== null) {
				error(400, { message: `There's been an issue getting the package count`, id: '' })
			}
			return count
		}),
		tag_count: await tagsGetCountController().then(([errors, count]) => {
			if (errors !== null) {
				error(400, { message: `There's been an issue getting the tags count`, id: '' })
			}
			return count
		})
	}
}
