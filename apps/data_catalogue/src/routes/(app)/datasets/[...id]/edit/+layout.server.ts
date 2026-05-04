import { redirect } from '@sveltejs/kit'

export const load = ({ locals }) => {
	if (!locals.session) {
		redirect(307, '/')
	}
}
