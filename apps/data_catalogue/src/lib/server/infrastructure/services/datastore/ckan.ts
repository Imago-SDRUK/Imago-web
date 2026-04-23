import { env } from '$env/dynamic/private'
import { SERVER_ERRORS } from '$lib/globals/server'
import type { DatasetService } from '$lib/server/application/services/dataset'
import type { DatastoreService } from '$lib/server/application/services/datastore'
import { err, ok } from '$lib/server/entities/errors'
import type { CSVW, CSVWColumn, CSVWTable } from '$lib/server/entities/models/datastore'
import type { CkanDatastore, CkanDatastoreCreate, CkanDatastoreField } from '$lib/types/ckan'
import { create, createCkanClient, get } from '$lib/utils/ckan/ckan'
import { error } from '@sveltejs/kit'

const SPLIT_CHAR = '@'

function csvwToDatastore({
	id,
	csvw,
	force,
	delete_fields
}: {
	csvw: CSVW
	id: string
	force?: boolean
	delete_fields?: boolean
}): CkanDatastoreCreate[] {
	const columns = csvw.tables.map((table) => {
		const column: CkanDatastoreCreate['fields'] = table.tableSchema.columns.map((column) => {
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
	keywords: string
}): CkanDatastoreField => ({
	id: handleColumnToFieldID({ name: column.name, table, split: SPLIT_CHAR }),
	type: column.dataType,
	info: {
		label: column.title,
		notes: column.description,
		propertyURL: column.propertyURL,
		table_name: table,
		keywords
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
	const tables = datastore.fields.reduce((acc, field) => {
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
			keywords: '',
			tableSchema: {
				columns: [datastoreFieldToCSVWColumn(field)]
			}
		})
		return acc
	}, [] as CSVWTable[])
	return {
		'@context': 'http://www.w3.org/ns/csvw',
		'@type': 'TableGroup',
		tables
	}
}

const createDataset: DatasetService['createDataset'] = async () => {
	return {
		id: '',
		extras: [],
		groups: [],
		isopen: false,
		name: '',
		owner_org: '',
		metadata_created: '',
		creator_user_id: '',
		metadata_modified: '',
		private: false,
		state: '',
		title: '',
		type: '',
		resources: []
	}
}

const getStructuralMetadata: DatastoreService['getStructuralMetadata'] = async ({ id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(get('datastore_info', { resource_id: id }))
		if (res.success) {
			return ok(datastoreToCsvw(res.result))
		}
		return err({ reason: 'Unexpected', errors: res })
	} catch (_err) {
		return err({ reason: 'Unexpected', errors: _err })
	}
}

const setStructuralMetadata: DatastoreService['setStructuralMetadata'] = async ({
	metadata,
	id
}) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})

		const record = csvwToDatastore({
			id: id,
			csvw: metadata,
			force: true
			// delete_fields: true
		})
		const result = await Promise.all(
			record.map(async (table) => {
				return ckan.request(create('datastore_create', table)).then((res) => {
					if (res.success) {
						return datastoreToCsvw(res.result)
					}
					error(...SERVER_ERRORS[500])
				})
			})
		)
		return ok(result)
	} catch (_err) {
		return err({ reason: 'Unexpected', errors: _err })
	}
}

// TODO: evaluate update process as there is no easy way to update previous data without overriding the whole row
const updateStructuralMetadata: DatastoreService['updateStructuralMetadata'] = async ({
	metadata,
	id
}) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})

		const record = csvwToDatastore({
			id: id,
			csvw: metadata,
			force: true,
			delete_fields: true
		})
		const result = await Promise.all(
			record.map(async (table) => {
				return ckan.request(create('datastore_create', table)).then((res) => {
					if (res.success) {
						return datastoreToCsvw(res.result)
					}
					error(...SERVER_ERRORS[500])
				})
			})
		)
		return ok(result)
	} catch (_err) {
		return err({ reason: 'Unexpected', errors: _err })
	}
}

export const infrastructureServiceDatastoreCkan: DatastoreService = {
	getStructuralMetadata,
	setStructuralMetadata,
	updateStructuralMetadata
}
