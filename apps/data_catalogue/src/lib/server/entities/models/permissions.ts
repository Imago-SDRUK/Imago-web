import { type } from 'arktype'

export type Relationship = {
	/**
	 * Namespace of the Relation Tuple
	 * @type {string}
	 * @memberof Relationship
	 */
	namespace: string
	/**
	 * Object of the Relation Tuple
	 * @type {string}
	 * @memberof Relationship
	 */
	object: string
	/**
	 * Relation of the Relation Tuple
	 * @type {string}
	 * @memberof Relationship
	 */
	relation: string
	/**
	 * SubjectID of the Relation Tuple
	 *
	 * Either SubjectSet or SubjectID can be provided.
	 * @type {string}
	 * @memberof Relationship
	 */
	subject_id?: string
	/**
	 *
	 * @type {SubjectSet}
	 * @memberof Relationship
	 */
	subject_set?: SubjectSet
}

export type SubjectSet = {
	/**
	 * Namespace of the Subject Set
	 * @type {string}
	 * @memberof SubjectSet
	 */
	namespace: string
	/**
	 * Object of the Subject Set
	 * @type {string}
	 * @memberof SubjectSet
	 */
	object: string
	/**
	 * Relation of the Subject Set
	 * @type {string}
	 * @memberof SubjectSet
	 */
	relation: string
}

/**
 * Paginated Relationship List
 * @export
 * @interface Relationships
 */
export interface Relationships {
	/**
	 * The opaque token to provide in a subsequent request
	 * to get the next page. It is the empty string iff this is
	 * the last page.
	 * @type {string}
	 * @memberof Relationships
	 */
	next_page_token?: string
	/**
	 *
	 * @type {Array<Relationship>}
	 * @memberof Relationships
	 */
	relation_tuples?: Relationship[]
}

type AvailableNamespaces =
	| 'Answer'
	| 'Question'
	| 'ResourceVersion'
	| 'Resource'
	| 'Dataset'
	| 'Action'
	| 'Group'
	| 'User'

const AvailableNamespaces = type(
	'"Answer" | "Question" | "ResourceVersion" | "Resource" | "Dataset" | "Action" | "Group" | "User"'
)

const Actor = type({
	namespace: AvailableNamespaces,
	object: 'string',
	relation: 'string'
}).or('string')

export const PermissionValidateSchema = type({
	namespace: AvailableNamespaces,
	'object?': 'string',
	'permits?': 'string',
	actor: Actor
})

export const PermissionQuerySchema = type({
	namespace: AvailableNamespaces,
	'object?': 'string',
	'permits?': 'string',
	'actor?': Actor
})

export type Permission = typeof PermissionValidateSchema.infer
export type PermissionQuery = typeof PermissionQuerySchema.infer

// export type Permission = {
// 	namespace: AvailableNamespaces
// 	object?: string
// 	permits?: string
// 	actor:
// 		| string
// 		| {
// 				namespace: string
// 				object: string
// 				relation: string
// 		  }
// }

export const PermissionRequestSchema = type({
	namespace: AvailableNamespaces,
	object: 'string',
	relation: 'string',
	actor: Actor
})

export type PermissionRequest = typeof PermissionRequestSchema.inferIn

export type PermissionDelete = {
	namespace: AvailableNamespaces
	object: string
	relation?: string
	actor?:
		| string
		| {
				namespace: string
				object: string
				relation: string
		  }
}

export type AvailableActor = {
	label: string
	actor: typeof Actor.infer
}

export type PermissionActor = {
	label: string
	actor: typeof Actor.infer
	relation: string
}
