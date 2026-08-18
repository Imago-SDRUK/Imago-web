export type AzureError = {
	name: string
	code: string
	statusCode: 400
	details: {
		error: {
			code: string
			message: string
		}
	}
	request: {
		url: string
		headers: {
			'content-type': string
			accept: string
			'accept-encoding': string
			'user-agent': string
			'x-ms-client-request-id': string
			authorization: string
			'content-length': string
		}
		method: string
		timeout: 0
		disableKeepAlive: boolean
		streamResponseStatusCodes: Record<string, unknown>
		withCredentials: boolean
		requestId: string
		allowInsecureConnection: boolean
		enableBrowserStreams: boolean
	}
}
