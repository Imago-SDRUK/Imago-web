// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session } from '$lib/server/entities/models/identity'
import type { CkanClient } from '$lib/utils/ckan'

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			id: string
			message: string
		}
		interface Locals {
			access: boolean
			ckan: CkanClient
			session?: Session
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
