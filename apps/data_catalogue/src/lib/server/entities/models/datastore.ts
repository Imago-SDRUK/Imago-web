export type CSVWColumn = {
	name: string
	dataType: string
	description: string
	title: string
	propertyURL: string
}

export type CSVWTable = {
	'dc:title': string
	keywords: string
	tableSchema: {
		columns: CSVWColumn[]
	}
}

export type CSVW = {
	'@context': string
	'@type': string
	tables: CSVWTable[]
}
