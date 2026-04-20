import type { DatasetRequest } from '$lib/server/entities/models/datasets'

export const METADATA_KEYS = [
	{
		key: 'source',
		value: ''
	},
	{
		key: 'content',
		value: ''
	},
	{
		key: 'file_id',
		value: ''
	},
	{
		key: 'constraints',
		value: ''
	},
	{
		key: 'crs',
		value: ''
	},
	{
		key: 'spatial_coverage',
		value: ''
	},
	{
		key: 'spatial_resolution',
		value: ''
	},
	{
		key: 'temporal_coverage',
		value: ''
	},
	{
		key: 'temporal_resolution',
		value: ''
	},
	{
		key: 'size',
		value: ''
	},
	{
		key: 'lineage',
		value: ''
	},
	{
		key: 'data_source',
		value: ''
	},
	{
		key: 'data_quality',
		value: ''
	}
]

export const METADATA_LABELS = {
	source: 'Source',
	content: 'Content',
	last_changed_date: 'Last changed date',
	creation_date: 'Creation date',
	file_id: 'File ID',
	constraints: 'Constraints',
	crs: 'CRS',
	spatial_coverage: 'Spatial coverage',
	spatial_resolution: 'Spatial resolution',
	temporal_coverage: 'Temporal coverage',
	temporal_resolution: 'Temporal resolution',
	size: 'Size',
	lineage: 'Lineage',
	data_source: 'Data source',
	data_quality: 'Data quality'
}

export const generateExtrasFromPayload = (payload?: DatasetRequest['extras']) => {
	const metadata = structuredClone(METADATA_KEYS)
	const extras = payload
	if (extras) {
		extras
			.filter((extra) => METADATA_KEYS.find((me) => me.key === extra.key))
			.forEach((extra) => {
				const index = metadata.findIndex((me) => me.key === extra.key)
				metadata[index].value = extra.value
			})
	}
	return metadata
}
