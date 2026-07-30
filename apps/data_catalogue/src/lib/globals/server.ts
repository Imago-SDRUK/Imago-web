export const SERVER_ERRORS: { [k: number]: [number, { message: string; id: string }] } = {
	400: [
		400,
		{
			message: `Please check your request and try again`,
			id: 'bad-request'
		}
	],
	401: [401, { message: 'Unauthorised', id: 'unauthorised' }],
	403: [
		403,
		{
			message: `You cannot do this.`,
			id: 'forbidden'
		}
	],
	404: [
		404,
		{
			message: `We couldn't find this page or it may have been removed.`,
			id: 'not-found'
		}
	],
	500: [
		500,
		{
			message: `There's been an error on our side. Please try again.`,
			id: 'server-error'
		}
	],
	503: [
		503,
		{
			message: `Service is currently offline`,
			id: 'service-unavailable'
		}
	]
}

export const COOKIES = {
	access_token: 'imago-invite',
	expire: 'imago-invite-expire',
	identity_token: 'kratos-api'
}
