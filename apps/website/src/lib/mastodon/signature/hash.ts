import { createHash, createSign, createVerify, constants, verify } from 'node:crypto'

export function hashSHA256(data: string) {
	return createHash('sha256').update(data).digest('base64')
}
