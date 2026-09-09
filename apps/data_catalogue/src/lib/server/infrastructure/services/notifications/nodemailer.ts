import type { INotificationsService } from '$lib/server/application/services/notifications'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import type Mail from 'nodemailer/lib/mailer'
import { err, ok } from '$lib/server/entities/errors'
import { env } from '$env/dynamic/private'
import nodemailer from 'nodemailer'
import { log } from '$lib/utils/server/logger'

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
				rejectUnauthorized: env.NODE_ENV === 'production' ? true : false,
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
		const options: Mail.Options = {
			from: env.NOTIFICATIONS_SMTP_SENDER,
			to: to,
			bcc: env.NOTIFICATIONS_SMTP_BCC ?? undefined,
			subject: subject,
			html: message,
			text: message
		}
		const [email_error] = await transporter
			.sendMail(options)
			.then(() => ok(null))
			.catch((_err) => {
				log.error({ message: `There's been an error sending this email` })
				console.log(_err)
				return err({ reason: 'Unexpected', error: _err })
			})
		if (email_error !== null) {
			return err(email_error)
		}
		return ok({ success: true })
	} catch (_err) {
		console.log(_err)
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const infrastructureServiceNotificationsNodemailer: INotificationsService = {
	sendNotification
}
