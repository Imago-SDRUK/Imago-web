import { type GroupService, GroupServiceSchema } from '$lib/server/entities/models/groups'
import { type } from 'arktype'

export type Tag = {
	display_name: string
	id: string
	name: string
	state: 'active' | 'draft'
	vocabulary_id: string | null
}

export const TagSchema = type({
	name: 'string',
	vocabulary_id: 'string'
})

export type TagRequest = typeof TagSchema.infer

export type Vocabulary = {
	name: string
	tags: Tag[]
	id: string
}

export const VocabularySchema = type({
	name: 'string',
	'tags?': [TagSchema, '[]']
})

export type VocabularyRequest = typeof VocabularySchema.infer

const DatasetExtrasSchema = type({
	key: 'string',
	value: 'string'
})

// const DatasetExtrasSchema = type({
// 	'source?': 'string',
// 	'content?': 'string',
// 	'file_id?': 'string',
// 	'constraints?': 'string',
// 	'crs?': 'string',
// 	'spatial_coverage?': 'string',
// 	'spatial_resolution?': 'string',
// 	'temporal_coverage?': 'string',
// 	'temporal_resolution?': 'string',
// 	'size?': 'string',
// 	'lineage?': 'string',
// 	'data_source?': 'string',
// 	'data_quality?': 'string'
// })

export type DatasetExtrasKeys = typeof DatasetExtrasSchema.infer

/**
 * NOTE: This is the return type
 **/

export type Dataset = {
	id: string
	name: string
	creator_user_id: string
	isopen: boolean
	owner_org: string
	private: boolean
	state: string
	title: string
	type: string
	tags: Tag[]
	extras: { key: string; value: string }[]
	groups: GroupService[]
	author?: string | null
	author_email?: string | null
	license_id?: string | null
	license_url?: string | null
	license_title?: string | null
	maintainer?: string | null
	maintainer_email?: string | null
	metadata_created: string
	metadata_modified: string
	notes?: string | null
	num_resources?: number
	num_tags?: number
	url?: string | null
	version?: string | null
	resources: Resource[]
	// organization: CkanOrganisation
	// relationships_as_subject: []
	// relationships_as_object: []
}

/**
 * NOTE: This is the insert schema defined with Arktype
 **/

export const DatasetSchema = type({
	title: 'string',
	groups: type([GroupServiceSchema, '[]']).atLeastLength(1),
	'id?': 'string.uuid',
	'name?': 'string',
	'owner_org?': 'string',
	'private?': 'boolean',
	'state?': '"draft" | "published"',
	'type?': 'string',
	'creator_user_id?': 'string | null',
	'isopen?': 'boolean',
	'tags?': [TagSchema, '[]'],
	'extras?': [DatasetExtrasSchema, '[]'],
	'author?': 'string | null',
	'author_email?': ' string | null',
	'license_id?': ' string | null',
	'license_url?': ' string | null',
	'license_title?': ' string | null',
	'maintainer?': ' string | null',
	'maintainer_email?': ' string | null',
	'metadata_created?': 'string',
	'metadata_modified?': 'string',
	'notes?': ' string | null',
	'url?': ' string | null',
	'version?': ' string.semver | null'
	// resources: Resource[]
})

/**
 * NOTE: This is the insert type derived from the schema
 **/

export type DatasetRequest = typeof DatasetSchema.infer

export type Resource = {
	id: string
	package_id: string
	last_modified?: string | null
	metadata_modified: string
	mimetype?: string | null
	mimetype_inner?: string | null
	name: string
	position: 0
	resource_type?: string | null
	size?: string | null
	state: string
	url?: string
	url_type: string
	cache_last_updated?: string | null
	cache_url?: string | null
	created: string
	datastore_active: false
	description: string
	format: string
	hash: string
}

export type DatasetActivity = {
	id: string
	timestamp: string
	user_id: string
	object_id: string
	activity_type: string
	data: {
		package: Dataset
		actor: string
	}
	permission_labels: string[]
}
