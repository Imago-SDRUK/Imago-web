import { type } from 'arktype'

export const CSVWColumn = type({
	name: 'string',
	dataType: 'string',
	description: 'string',
	title: 'string',
	propertyURL: 'string'
})

export const CSVWTable = type({
	'dc:title': 'string',
	keywords: 'string[]',
	tableSchema: {
		columns: [CSVWColumn, '[]']
	}
})
export const CSVW = type({
	'@context': 'string',
	'@type': 'string',
	tables: [CSVWTable, '[]']
})

export type CSVWTable = typeof CSVWTable.infer
export type CSVWColumn = typeof CSVWColumn.inferOut

export type CSVWRequest = typeof CSVW.inferIn
export type CSVW = typeof CSVW.inferOut

export const CkanDatastoreField = type({
	id: 'string',
	type: 'string',
	info: {
		label: 'string',
		notes: 'string',
		'type_override?': 'string',
		'table_name?': 'string',
		'propertyURL?': 'string',
		'keywords?': 'string'
	},
	schema: {
		native_type: 'string',
		notnull: 'boolean',
		index_name: 'string|null',
		is_index: 'boolean',
		uniquekey: 'boolean'
	}
})
export type CkanDatastoreField = typeof CkanDatastoreField.infer

export const CkanDatastoreMetadata = type({
	id: 'string',
	count: 'number',
	table_type: 'string',
	size: 'number',
	db_size: 'number',
	idx_size: 'number',
	aliases: 'string[]'
})

export const CkanDatastore = type({
	meta: CkanDatastoreMetadata,
	fields: [CkanDatastoreField, '[]']
})

export type CkanDatastore = typeof CkanDatastore.infer

export const CkanDatastorePayload = type({
	resource_id: 'string', // resource id that the data is going to be stored against
	'force?': 'boolean', // set to True to edit a read-only table
	'aliases?': 'string[]', // names for read only aliases of the resource. (optional)
	'fields?': [CkanDatastoreField, '[]'], // fields/columns and their extra metadata. (optional)
	'delete_fields?': 'boolean', // set to True to remove existing fields not passed
	'records?': [{ ['string']: 'string' }, '[]'], // the data, eg: [{"dob": "2005", "some_stuff": ["a", "b"]}] (optional)
	'include_records?': 'boolean', // return the full values of inserted records (optional, default: False)
	'primary_key?': 'string[]', // fields that represent a unique key (optional)
	'indexes?': 'string[]', // indexes on table (optional)
	'calculate_record_count?': 'boolean' // updates the stored count of records, used to optimize datastore_search in combination with the total_estimation_threshold parameter. If doing a series of requests to change a resource, you only need to set this to True on the last request.
	// triggers: '{ function: string }[]|undefined', // trigger functions to apply to this table on update/insert. functions may be created with datastore_function_create(). eg: [ {"function": "trigger_clean_reference"}, {"function": "trigger_check_codes"}]
	// resource: {
	// 	package_id: string
	// }|undefined, // resource dictionary that is passed to resource_create(). Use instead of resource_id (optional)
})

export type CkanDatastoreRequest = typeof CkanDatastorePayload.infer
