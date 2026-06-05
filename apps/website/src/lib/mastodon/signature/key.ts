import { env } from '$env/dynamic/private'

export const loadMastodonPrivateKey = () =>
	Buffer.from(env.RSA_PRIVATE_KEY, 'base64').toString().trim()

export const loadMastodonPublicKey = () =>
	Buffer.from(env.RSA_PUBLIC_KEY, 'base64').toString().trim()
