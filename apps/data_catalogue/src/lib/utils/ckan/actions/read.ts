import type {
	CkanDataset,
	CkanDatastore,
	CkanDatastoreField,
	CkanGroup,
	CkanResource,
	CkanTag
} from '$lib/types/ckan'

type PackageList = [
	'package_list',
	{
		limit?: number
		offset?: number
	},
	string[]
]

type CurrentPackageListWithResources = [
	'current_package_list_with_resources',
	{
		limit?: number
		offset?: number
		page?: number
	},
	{
		id: string
		name: string
		resources: CkanResource[]
		metadata_modified: string
	}[]
]

type PackageShow = [
	'package_show',
	{
		id: string
		use_default_schema?: boolean
		include_plugin_data?: boolean
	},
	CkanDataset
]

type PackageSearch = [
	'package_search',
	{
		q?: string
		fq?: string | null
		fq_list?: string[]
		sort?: string
		rows?: number
		start?: number
		facet?: string
		'facet.mincount'?: number
		'facet.limit'?: number
		'facet.field'?: string[]
		include_drafts?: boolean
		include_private?: boolean
		use_default_schema?: boolean
		include_deleted?: boolean
	},
	{ count: number; facets: Record<PropertyKey, unknown>; results: CkanDataset[] }
]

type MemberList = [
	'member_list',
	{
		id: string
		object_type?: string
		capacity?: string
	},
	{
		id: string
		type: string
		capacity: string
	}[]
]

type MemberRolesList = [
	'member_roles_list',
	{
		group_type?: string
	},
	string[]
]

type PackageCollaboratorList = [
	'package_collaborator_list',
	{
		id: string
		capacity?: string
	},
	{
		package_id: string
		user_id: string
		capacity: string
		last_modified: string
	}[]
]

type PackageCollaboratorListForUser = [
	'package_collaborator_list_for_user',
	{
		id: string
		capacity?: string
	},
	{
		package_id: string
		capacity: string
		last_modified: string
	}[]
]

type GroupList = [
	'group_list',
	{
		type?: string
		order_by?: string
		sort?: string
		limit?: number
		offset?: number
		groups?: string[]
		all_fields?: boolean
		include_dataset_count?: boolean
		include_extras?: boolean
		include_groups?: boolean
		include_users?: boolean
	},
	string[] | CkanGroup[]
]

type GroupShow = [
	'group_show',
	{
		id: string
		include_datasets?: boolean
		include_dataset_count?: boolean
		include_extras?: boolean
		include_users?: boolean
		include_groups?: boolean
		include_followers?: boolean
	},
	CkanGroup
]

type GroupPackageShow = [
	'group_package_show',
	{
		id: string
		limit?: number
	},
	CkanDataset[]
]

type OrganizationList = [
	'organization_list',
	{
		type?: string
		order_by?: string
		sort?: string
		limit?: number
		offset?: number
		organizations?: string[]
		all_fields?: boolean
		include_dataset_count?: boolean
		include_extras?: boolean
		include_groups?: boolean
		include_users?: boolean
	},
	string[] | CkanGroup[]
]

type OrganizationShow = [
	'organization_show',
	{
		id: string
		include_datasets?: boolean
		include_dataset_count?: boolean
		include_extras?: boolean
		include_users?: boolean
		include_groups?: boolean
		include_followers?: boolean
	},
	CkanGroup
]

type UserList = [
	'user_list',
	{
		q?: string
		email?: string
		order_by?: string
		all_fields?: boolean
		include_site_user?: boolean
	},
	(
		| string[]
		| {
				id: string
				name: string
				fullname: string
				display_name: string
				email: string
				about: string
				sysadmin: boolean
				number_created_packages: number
		  }[]
	)
]

type UserShow = [
	'user_show',
	{
		id?: string
		include_datasets?: boolean
		include_num_followers?: boolean
		include_password_hash?: boolean
		include_plugin_extras?: boolean
	},
	{
		id: string
		name: string
		fullname: string
		display_name: string
		email: string
		about: string
		sysadmin: boolean
		number_created_packages: number
		number_followers: number
		email_hash: string
		apikey: string
	}
]
/**
 * Return the metadata of a resource.
 **/
type ResourceShow = [
	/**
	 * Return the metadata of a resource.
	 **/
	'resource_show',
	/**
	 * Return the metadata of a resource.
	 **/
	{
		id: string
	},
	CkanResource
]

type ResourceSearch = [
	'resource_search',
	{
		query: string | string[]
		order_by?: string
		offset?: number
		limit?: number
	},
	{
		count: number
		results: CkanResource[]
	}
]

type TagList = [
	'tag_list',
	{
		query?: string
		vocabulary_id?: string
		all_fields?: boolean
	},
	string[] | CkanTag[]
]

type TagShow = [
	'tag_show',
	{
		id: string
		vocabulary_id?: string
		include_datasets?: boolean
	},
	CkanTag
]

type FolloweeList = [
	'followee_list',
	{
		id: string
		q?: string
	},
	{
		id: string
		type: string
		display_name: string
	}[]
]

type UserFollowerCount = [
	'user_follower_count',
	{
		id: string
	},
	number
]

type DatasetFollowerCount = [
	'dataset_follower_count',
	{
		id: string
	},
	number
]

type GroupFollowerCount = [
	'group_follower_count',
	{
		id: string
	},
	number
]

type ConfigOptionShow = [
	'config_option_show',
	{
		key: string
	},
	string
]

type ConfigOptionList = ['config_option_list', undefined, string[]]

type JobList = [
	'job_list',
	{
		queues?: string[]
		limit?: number
		ids_only?: boolean
	},
	{
		id: string
		queue: string
		state: string
		created: string
		started: string
		finished: string
		worker_name: string
		result: unknown
	}[]
]

type JobShow = [
	'job_show',
	{
		id: string
	},
	{
		id: string
		queue: string
		state: string
		created: string
		started: string
		finished: string
		worker_name: string
		result: unknown
	}
]

type ApiTokenList = [
	'api_token_list',
	{
		user_id?: string
		user?: string
	},
	{
		id: string
		user_id: string
		name: string
		created: string
		expires: string
	}[]
]

type VocabularyList = [
	'vocabulary_list',
	undefined,
	{
		id: string
		name: string
		tags: CkanTag[]
	}[]
]

type VocabularyShow = [
	'vocabulary_show',
	{
		id: string
	},
	{
		id: string
		name: string
		tags: CkanTag[]
	}
]

type StatusShow = [
	'status_show',
	undefined,
	{
		ckan_version: string
		site_id: string
		site_title: string
		site_url: string
		site_description: string
		state: string
		plugins: Record<string, unknown>
	}
]

type OrganizationFollowerCount = [
	'organization_follower_count',
	{
		id: string
	},
	number
]

type UserFollowerList = [
	'user_follower_list',
	{
		id: string
	},
	{
		id: string
		display_name: string
	}[]
]

type DatasetFollowerList = [
	'dataset_follower_list',
	{
		id: string
	},
	{
		id: string
		display_name: string
	}[]
]

type GroupFollowerList = [
	'group_follower_list',
	{
		id: string
	},
	{
		id: string
		display_name: string
	}[]
]

type OrganizationFollowerList = [
	'organization_follower_list',
	{
		id: string
	},
	{
		id: string
		display_name: string
	}[]
]

type FolloweeCount = [
	'followee_count',
	{
		id: string
	},
	number
]

type UserFolloweeCount = [
	'user_followee_count',
	{
		id: string
	},
	number
]

type DatasetFolloweeCount = [
	'dataset_followee_count',
	{
		id: string
	},
	number
]

type GroupFolloweeCount = [
	'group_followee_count',
	{
		id: string
	},
	number
]

type OrganizationFolloweeCount = [
	'organization_followee_count',
	{
		id: string
	},
	number
]

type UserFolloweeList = [
	'user_followee_list',
	{
		id: string
	}
]

type DatasetFolloweeList = [
	'dataset_followee_list',
	{
		id: string
	},
	{
		id: string
		name: string
		title: string
	}[]
]

type GroupFolloweeList = [
	'group_followee_list',
	{
		id: string
	},
	{
		id: string
		name: string
		title: string
	}[]
]

type OrganizationFolloweeList = [
	'organization_followee_list',
	{
		id: string
	},
	{
		id: string
		name: string
		title: string
	}[]
]

type AmFollowingUser = [
	'am_following_user',
	{
		id: string
	},
	boolean
]

type AmFollowingDataset = [
	'am_following_dataset',
	{
		id: string
	},
	boolean
]

type AmFollowingGroup = [
	'am_following_group',
	{
		id: string
	},
	boolean
]

type ResourceViewShow = [
	'resource_view_show',
	{
		id: string
	},
	{
		id: string
		resource_id: string
		title: string
		view_type: string
		config: string
		order: number
	}
]

type ResourceViewList = [
	'resource_view_list',
	{
		id: string
	},
	{
		id: string
		resource_id: string
		title: string
		view_type: string
		config: string
		order: number
	}[]
]

type UserAutocomplete = [
	'user_autocomplete',
	{
		q: string
		limit?: number
		ignore_self?: boolean
	},
	{
		id: string
		name: string
		fullname: string
	}[]
]

type GroupAutocomplete = [
	'group_autocomplete',
	{
		q: string
		limit?: number
	},
	{
		id: string
		name: string
		title: string
	}[]
]

type OrganizationAutocomplete = [
	'organization_autocomplete',
	{
		q: string
		limit?: number
	},
	{
		id: string
		name: string
		title: string
	}[]
]

type PackageAutocomplete = [
	'package_autocomplete',
	{
		q: string
		limit?: number
	},
	{
		id: string
		name: string
		title: string
	}[]
]

type FormatAutocomplete = [
	'format_autocomplete',
	{
		q: string
		limit?: number
	},
	string[]
]

type TagAutocomplete = [
	'tag_autocomplete',
	{
		query: string
		vocabulary_id?: string
		fields?: Record<string, unknown>
		limit?: number
		offset?: number
	},
	string[]
]

type LicenseList = [
	'license_list',
	undefined,
	{
		id: string
		name: string
		title: string
		url: string
	}[]
]

type TermTranslationShow = [
	'term_translation_show',
	{
		terms: string | string[]
		lang_codes?: string | string[]
	},
	{
		term: string
		term_translation: string
		lang_code: string
	}[]
]

type GetSiteUser = [
	'get_site_user',
	{
		defer_commit?: boolean
	},
	{
		id: string
		name: string
		email: string
	}
]

type HelpShow = [
	'help_show',
	{
		name: string
	},
	string
]

type GroupListAuthz = [
	'group_list_authz',
	{
		available_only?: boolean
		am_member?: boolean
	},
	CkanGroup[]
]

type OrganizationListForUser = [
	'organization_list_for_user',
	{
		id?: string
		permission?: string
		include_dataset_count?: boolean
	},
	CkanGroup[]
]

type PackageRelationshipsList = [
	'package_relationships_list',
	{
		id: string
		id2?: string
		rel?: string
	},
	{
		subject: string
		object: string
		type: string
		comment: string
	}[]
]

type TaskStatusShow = [
	'task_status_show',
	{
		id?: string
		entity_id?: string
		task_type?: string
		key?: string
	},
	{
		id: string
		entity_id: string
		task_type: string
		key: string
		state: string
		error: string
		last_updated: string
	}
]

type TagSearch = [
	'tag_search',
	{
		query?: string | string[]
		vocabulary_id?: string
		fields?: Record<string, unknown>
		limit?: number
		offset?: number
	},
	{ count: number; results: CkanTag[] }
]
type DatastoreInfo = [
	'datastore_info',
	{
		resource_id: string
		include_meta?: boolean
		include_fields_schema?: boolean
	},
	CkanDatastore
]

type DatastoreSearch = [
	'datastore_search',
	{
		resource_id: string // resource id that the data is going to be stored under
		filters?: Record<string, unknown>[] // Filters for matching conditions to select, e.g {“key1”: “a”, “key2”: “b”} (optional)
		q?: string // full text query. If it’s a string, it’ll search on all fields on each row. If it’s a dictionary as {“key1”: “a”, “key2”: “b”}, it’ll search on each specific field (optional)
		full_text?: string // full text query. It search on all fields on each row. This should be used in replace of q when performing string search accross all fields
		distinct?: boolean // return only distinct rows (optional, default: false)
		plain?: boolean // treat as plain text query (optional, default: true)
		language?: string // language of the full text query (optional, default: english)
		limit?: number // maximum number of rows to return (optional, default: 100, unless set in the site’s configuration ckan.datastore.search.rows_default, upper limit: 32000 unless set in site’s configuration ckan.datastore.search.rows_max)
		offset?: number // offset this number of rows (optional)
		fields?: string[] // fields to return (optional, default: all fields in original order)
		sort?: string // comma separated field names with ordering e.g.: “fieldname1, fieldname2 desc nulls last”
		include_total?: boolean // True to return total matching record count (optional, default: true)
		total_estimation_threshold?: number // If “include_total” is True and “total_estimation_threshold” is not None and the estimated total (matching record count) is above the “total_estimation_threshold” then this datastore_search will return an estimate of the total, rather than a precise one. This is often good enough, and saves computationally expensive row counting for larger results (e.g. >100000 rows). The estimated total comes from the PostgreSQL table statistics, generated when Express Loader or DataPusher finishes a load, or by autovacuum. NB Currently estimation can’t be done if the user specifies ‘filters’ or ‘distinct’ options. (optional, default: None)
		records_format?: 'objects' | 'lists' | 'csv' | 'tsv' // the format for the records return value: ‘objects’ (default) list of {fieldname1: value1, …} dicts, ‘lists’ list of [value1, value2, …] lists, ‘csv’ string containing comma-separated values with no header, ‘tsv’ string containing tab-separated values with no header
	},
	{
		fields: CkanDatastoreField[]
		offset: number
		limit: number
		filters: Record<string, unknown>[]
		total: number
		total_was_estimated: boolean
		records: Record<string, unknown>[]
	}
]

export type CkanGetActions =
	| PackageList
	| CurrentPackageListWithResources
	| PackageShow
	| PackageSearch
	| MemberList
	| MemberRolesList
	| PackageCollaboratorList
	| PackageCollaboratorListForUser
	| GroupList
	| GroupShow
	| GroupPackageShow
	| OrganizationList
	| OrganizationShow
	| UserList
	| UserShow
	| ResourceSearch
	| TagList
	| TagShow
	| FolloweeList
	| UserFollowerCount
	| DatasetFollowerCount
	| GroupFollowerCount
	| ConfigOptionShow
	| ConfigOptionList
	| JobList
	| JobShow
	| ApiTokenList
	| VocabularyList
	| VocabularyShow
	| StatusShow
	| OrganizationFollowerCount
	| UserFollowerList
	| DatasetFollowerList
	| GroupFollowerList
	| OrganizationFollowerList
	| FolloweeCount
	| UserFolloweeCount
	| DatasetFolloweeCount
	| GroupFolloweeCount
	| OrganizationFolloweeCount
	| DatasetFolloweeList
	| GroupFolloweeList
	| OrganizationFolloweeList
	| AmFollowingUser
	| AmFollowingDataset
	| AmFollowingGroup
	| UserAutocomplete
	| ResourceViewShow
	| ResourceViewList
	| GroupAutocomplete
	| OrganizationAutocomplete
	| PackageAutocomplete
	| FormatAutocomplete
	| TagAutocomplete
	| LicenseList
	| GetSiteUser
	| HelpShow
	| GroupListAuthz
	| OrganizationListForUser
	| PackageRelationshipsList
	| TaskStatusShow
	| TagShow
	| TagSearch
	| ResourceShow
	| UserFolloweeList
	| TermTranslationShow
	| DatastoreInfo
	| DatastoreSearch
