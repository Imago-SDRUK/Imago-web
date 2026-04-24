export type SolrResponse = {
	help: string
	success: boolean
	count: number
	result: {
		count: number
		facets: Record<PropertyKey, unknown>
		expanded: Record<PropertyKey, unknown>
		results: Record<PropertyKey, unknown>[]
		sort: string
		search_facets: {
			pivot: Record<PropertyKey, unknown>
			queries: unknown[]
		}
		facet_pivot: Record<PropertyKey, unknown>
		facet_queries: Record<PropertyKey, unknown>
	}
}

export type CkanError = {
	success: false
	error: {
		[k: string]: string[]
	} & {
		__type: string
		message?: string
	}
}

// export type CkanResult<T> = {
// 	success: true
// 	result:
// 		| (T extends Record<PropertyKey, unknown> | Record<PropertyKey, unknown>
// 				? T & Record<PropertyKey, unknown>
// 				: Record<PropertyKey, unknown>)
// 		| (T extends Record<PropertyKey, unknown> | Record<PropertyKey, unknown>
// 				? T & Record<PropertyKey, unknown>
// 				: Record<PropertyKey, unknown>)[]
// }

export type CkanResult<T> = {
	success: true
	result: T
}

export type CkanJSONResponse<T> = {
	help: string
} & (CkanResult<T> | CkanError)

export type CkanTextError = {
	success: false
	message: string
	status: number
	result: []
}
