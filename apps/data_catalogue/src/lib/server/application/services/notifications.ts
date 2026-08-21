import type { ErrTypes } from '$lib/server/entities/errors'

export type INotificationsService = {
	sendNotification: ({
		message
	}: {
		to: string
		subject: string
		message: string
	}) => Promise<[ErrTypes, null] | [null, { success: boolean }]>
}
