import { env } from '$env/dynamic/private'
import { infrastructureServiceNotifications } from '$lib/server/infrastructure/services/notifications'

export const getNoficationsModule = () => {
	if (env.NODE_ENV === 'test') {
		return infrastructureServiceNotifications['test']
	}
	return infrastructureServiceNotifications['nodemailer']
}
