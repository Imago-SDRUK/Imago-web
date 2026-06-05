import { loadMastodonPrivateKey } from '$lib/mastodon/signature/key'
import { createSign, constants } from 'node:crypto'

export function generateDigitalSignature(data: string): string {
	const private_key = loadMastodonPrivateKey()
	const sign = createSign('RSA-SHA256')
	sign.update(data)
	const result = sign.sign(
		{
			key: private_key,
			padding: constants.RSA_PKCS1_PADDING
		},
		'base64'
	)
	return result
}

export function buildSignatureString(req: Request, headerList: string[]): string {
	return headerList
		.map((header) => {
			if (header === '(request-target)') {
				return `${header}: ${req.method.toLowerCase()} ${new URL(req.url).pathname}`
			}
			const value = req.headers.get(header.toLowerCase())
			if (!value) throw new Error(`Missing header: ${header}`)
			return `${header}: ${value}`
		})
		.join('\n')
}
