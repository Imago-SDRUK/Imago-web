export type Session = {
	id: string
	identity: {
		id: string
		first_name: string
		last_name: string
		email: string
	}
	active: boolean
	expires_at: string
	verified: boolean
	redirect_browser_to?: string
}
