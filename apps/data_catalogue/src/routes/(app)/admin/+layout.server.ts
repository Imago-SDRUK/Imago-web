import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	if (!locals.session?.identity.id) {
		redirect(307, '/')
	}
	if (locals.configuration.superusers === null) {
		redirect(307, '/')
	}
	//HACK: add admin permissions
	if (!locals.configuration.superusers.includes(locals.session?.identity.id)) {
		redirect(307, '/')
	}
}
// https://svelte.dev/docs/kit/load#Layout-data
