import type {
	CkanDatastore,
	CkanDatastoreField,
	CkanDatastoreRequest,
	CSVW,
	CSVWColumn,
	CSVWTable
} from '$lib/server/entities/models/datastore'
const SPLIT_CHAR = '@'

const handleColumnType = (type: string) => {
	if (type === 'string') {
		return 'text'
	}
	return type
}

export function csvwToDatastore({
	id,
	csvw,
	force,
	delete_fields
}: {
	csvw: CSVW
	id: string
	force?: boolean
	delete_fields?: boolean
}): CkanDatastoreRequest[] {
	const columns = csvw.tables.map((table) => {
		const column: CkanDatastoreField[] = table.tableSchema.columns.map((column) => {
			return CSVWColumnToDatastoreField({
				column,
				table: table['dc:title'],
				keywords: table.keywords
			})
		})
		return {
			resource_id: id,
			fields: column,
			force,
			delete_fields,
			filters: {
				title: table['dc:title'],
				keywords: table.keywords
			}
		}
	})
	return columns
}

const CSVWColumnToDatastoreField = ({
	column,
	table,
	keywords
}: {
	column: CSVWColumn
	table: string
	keywords: string[]
}): CkanDatastoreField => ({
	id: handleColumnToFieldID({ name: column.name, table, split: SPLIT_CHAR }),
	type: handleColumnType(column.dataType),
	info: {
		label: column.title,
		notes: column.description,
		propertyURL: column.propertyURL,
		table_name: table,
		keywords: keywords.join(',')
	},
	schema: {
		native_type: column.dataType === '' ? 'text' : column.dataType,
		notnull: false,
		index_name: null,
		is_index: false,
		uniquekey: false
	}
})

const handleColumnToFieldID = ({
	name,
	table,
	split
}: {
	name: string
	table: string
	split: string
}) => `${name}${split}${table}`
const handleFieldIDToColumnName = ({ id, split }: { id: string; split: string }) =>
	id.split(split)[0]

const datastoreFieldToCSVWColumn = (field: CkanDatastoreField): CSVWColumn => ({
	name: handleFieldIDToColumnName({ id: field.id, split: SPLIT_CHAR }),
	dataType: field.type,
	description: field.info.notes,
	title: field.info.label,
	propertyURL: String(field.info.propertyURL)
})

export function datastoreToCsvw(datastore: CkanDatastore): CSVW {
	const tables = datastore.fields?.reduce((acc, field) => {
		const table = field.info.table_name
		if (!table) {
			return acc
		}
		const table_index = acc.findIndex((t) => t['dc:title'] === field.info.table_name)
		if (table_index !== -1) {
			acc[table_index].tableSchema.columns.push(datastoreFieldToCSVWColumn(field))
			return acc
		}
		acc.push({
			'dc:title': table,
			keywords: [],
			tableSchema: {
				columns: [datastoreFieldToCSVWColumn(field)]
			}
		})
		return acc
	}, [] as CSVWTable[])
	return {
		'@context': 'http://www.w3.org/ns/csvw',
		'@type': 'TableGroup',
		tables: tables ?? []
	}
}
