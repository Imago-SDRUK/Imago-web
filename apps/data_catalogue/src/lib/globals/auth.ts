export const AUTH_GROUPS = ['admin', 'editor', 'viewer', 'public']
// export const AVAILABLE_RELATIONS = ['admins', 'editors', 'viewers', 'owners']
export const AVAILABLE_RELATIONS = [
	{
		label: 'Administrators',
		description: 'Can read, create, edit, delete and share.',
		value: 'admins'
	},
	{ label: 'Editors', description: 'Can edit, create and read.', value: 'editors' },
	{ label: 'Viewers', description: 'Can read.', value: 'viewers' }
]
