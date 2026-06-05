import { loadMastodonPublicKey } from '$lib/mastodon/signature/key'
import { createVerify, verify, constants } from 'node:crypto'

export function validateDigitalSignature(
	data: string,
	receivedSignature: string,
	key: string
): boolean {
	const _key = key ?? loadMastodonPublicKey()
	const verify = createVerify('RSA-SHA256')
	verify.update(data)
	return verify.verify(_key, receivedSignature, 'base64')
}

export function validateMastodonSignature(
	signature_string: string,
	receivedSignature: string
): boolean {
	const key = loadMastodonPublicKey()
	const result = verify(
		'sha256',
		Buffer.from(signature_string),
		{
			key: key,
			padding: constants.RSA_PKCS1_PADDING
		},
		Buffer.from(receivedSignature, 'base64')
	)
	return result
}
