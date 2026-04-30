export const SOLR_SEARCH_PARAMETERS = [
	'vocab_general',
	'organization',
	'groups',
	'res_format',
	'license_id'
]

export const getSolrSearchParams = (url: URL) =>
	SOLR_SEARCH_PARAMETERS.map((key) => ({
		key,
		value: url.searchParams.getAll(key)
	}))
		.filter(({ value }) => value !== null)
		.reduce((str: string | null = null, { key, value }) => {
			const split = value
			let built = ''
			if (split.length === 0) return str
			if (split.length === 1) {
				built = `${key}:"${split[0]}"`
			} else {
				built = `${key}:(${value.map((value) => `"${value}"`).join(' AND ')})`
			}
			if (!str) {
				str = ''
			} else {
				// str += '&fg='
				str += ' '
			}
			str += built
			return str
		}, null)
