import type { INotificationsService } from '$lib/server/application/services/notifications'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import { err, ok } from '$lib/server/entities/errors'
import { env } from '$env/dynamic/private'
import nodemailer from 'nodemailer'

const sendNotification: INotificationsService['sendNotification'] = async ({
	message,
	subject,
	to
}) => {
	try {
		const transport: SMTPTransport.Options = {
			host: String(env.NOTIFICATIONS_SMTP_HOST),
			port: Number(env.NOTIFICATIONS_SMTP_PORT),
			secure: env.NOTIFICATIONS_SMTP_SECURE == 'true' ? true : false,
			auth: {
				user: env.NOTIFICATIONS_SMTP_USER,
				pass: env.NOTIFICATIONS_SMTP_PASSWORD
			},
			tls: {
				rejectUnauthorized: false,
				ciphers: 'SSLv3'
			},
			ignoreTLS: env.NOTIFICATIONS_SMTP_IGNORE_TLS == 'true' ? true : false
		}
		console.log(transport)
		console.log(
			env.NOTIFICATIONS_SMTP_CONNECTION_STRING ? 'using connection string' : 'using transport'
		)
		const transporter = nodemailer.createTransport(
			env.NOTIFICATIONS_SMTP_CONNECTION_STRING ?? transport
		)
		const options = {
			from: env.NOTIFICATIONS_SMTP_SENDER,
			to: to,
			bcc: env.NOTIFICATIONS_SMTP_BCC ?? undefined,
			subject: subject,
			html: message
		}
		transporter.sendMail(options)
		return ok({ success: true })
	} catch (_err) {
		console.log(_err)
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const infrastructureServiceNotificationsTest: INotificationsService = {
	sendNotification
}
