import { infrastructureServiceNotificationsNodemailer } from '$lib/server/infrastructure/services/notifications/nodemailer'
import { infrastructureServiceNotificationsTest } from '$lib/server/infrastructure/services/notifications/test'

export const infrastructureServiceNotifications = {
	nodemailer: infrastructureServiceNotificationsNodemailer,
	test: infrastructureServiceNotificationsTest
}
