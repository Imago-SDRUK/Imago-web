import type {
	CkanDataset,
	CkanDatasetRequest,
	CkanDatastore,
	CkanDatastoreCreate,
	CkanGroup,
	CkanResource,
	CkanTag
} from '$lib/types/ckan'

type PackageCreate = ['package_create', CkanDatasetRequest, CkanDataset]

type ResourceCreate = [
	'resource_create',
	{
		id?: string
		package_id: string // id of package that the resource should be added to
		url: string // url of resource
		description?: string
		format?: string
		hash?: string
		name?: string
		resource_type?: string
		mimetype?: string
		mimetype_inner?: string
		cache_url?: string
		size?: number
		created?: string // iso date string
		last_modified?: string // iso date string
		cache_last_updated?: string // iso date string
		upload?: unknown // FieldStorage (needs multipart/form-data)
	},
	CkanResource
]

type ResourceViewCreate = [
	'resource_view_create',
	{
		resource_id: string // id of the resource
		title: string // the title of the view
		description?: string // a description of the view
		view_type: string // type of view
		config?: string // options necessary to recreate a view state (JSON string)
	}
]

type UserCreate = [
	'user_create',
	{
		name: string // between 2 and 100 characters, containing only lowercase alphanumeric characters, - and _
		email: string // the email address for the new user
		password: string // at least 4 characters
		id?: string
		fullname?: string
		about?: string
		image_url?: string
		plugin_extras?: Record<string, unknown> // private extra user data belonging to plugins
		with_apitoken?: boolean // whether to create an API token for the user
	}
]

type UserInvite = [
	'user_invite',
	{
		email: string // the email of the user to be invited to the group
		group_id: string // the id or name of the group
		role: string // role of the user in the group (member, editor, or admin)
	}
]

type VocabularyCreate = [
	'vocabulary_create',
	{
		/**
		 * the name of the new vocabulary, e.g. 'Genre'
		 **/
		name: string
		/**
		 * the new tags to add to the new vocabulary
		 **/
		tags?: CkanTag[]
	},
	{
		id: string
		name: string
		tags: CkanTag[]
	}
]

type TagCreate = [
	'tag_create',
	{
		name: string // between 2 and 100 characters long containing only alphanumeric characters, spaces and -, _ and .
		vocabulary_id: string // the id of the vocabulary that the new tag should be added to
	},
	CkanTag
]

type GroupCreate = [
	'group_create',
	{
		name: string // between 2 and 100 characters long, containing only lowercase alphanumeric characters, - and _
		id?: string
		title?: string
		description?: string
		image_url?: string
		type?: string // default: 'group'
		state?: string // e.g. 'active' or 'deleted'
		approval_status?: string
		extras?: unknown[] // arbitrary (key: value) metadata items
		packages?: { name: string; title?: string }[] // datasets that belong to the group
		groups?: { name: string; capacity?: string }[] // groups that belong to the group
		users?: { name: string; capacity?: string }[] // users that belong to the group
	},
	CkanGroup
]

type OrganizationCreate = [
	'organization_create',
	{
		name: string // between 2 and 100 characters long, containing only lowercase alphanumeric characters, - and _
		id?: string
		title?: string
		description?: string
		image_url?: string
		state?: string // e.g. 'active' or 'deleted'
		approval_status?: string
		extras?: unknown[] // arbitrary (key: value) metadata items
		packages?: { name: string; title?: string }[] // datasets that belong to the organization
		users?: { name: string; capacity?: string }[] // users that belong to the organization
	}
]

type GroupMemberCreate = [
	'group_member_create',
	{
		id: string // the id or name of the group
		username: string // name or id of the user to be made member of the group
		role: string // role of the user in the group (member, editor, or admin)
	}
]

type OrganizationMemberCreate = [
	'organization_member_create',
	{
		id: string // the id or name of the organization
		username: string // name or id of the user to be made member of the organization
		role: string // role of the user in the organization (member, editor, or admin)
	}
]

type FollowUser = [
	'follow_user',
	{
		id: string // the id or name of the user to follow
	}
]

type FollowDataset = [
	'follow_dataset',
	{
		id: string // the id or name of the dataset to follow
	}
]

type FollowGroup = [
	'follow_group',
	{
		id: string // the id or name of the group to follow
	}
]

type ApiTokenCreate = [
	'api_token_create',
	{
		user: string // name or id of the user who owns new API Token
		name: string // distinctive name for API Token
	}
]

export type DatastoreCreate = ['datastore_create', CkanDatastoreCreate, CkanDatastore]

export type CkanCreateActions =
	| PackageCreate
	| ResourceCreate
	| ResourceViewCreate
	| UserCreate
	| UserInvite
	| VocabularyCreate
	| TagCreate
	| GroupCreate
	| OrganizationCreate
	| GroupMemberCreate
	| OrganizationMemberCreate
	| FollowUser
	| FollowDataset
	| FollowGroup
	| ApiTokenCreate
	| DatastoreCreate
