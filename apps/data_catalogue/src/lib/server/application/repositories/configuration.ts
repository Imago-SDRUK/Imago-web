import type { ErrTypes } from '$lib/server/entities/errors'
import type { Configuration, ConfigurationRequest } from '$lib/server/entities/models/configuration'

export type ConfigurationRepository = {
	initialiseConfiguration: ({
		config
	}: {
		config: ConfigurationRequest
	}) => Promise<[ErrTypes, null] | [null, Configuration]>
	setAdminGroup: ({
		id
	}: {
		id: string
		config_id: string
	}) => Promise<[ErrTypes, null] | [null, Configuration]>
	addSuperUser: ({
		id
	}: {
		id: string
		config_id: string
	}) => Promise<[ErrTypes, null] | [null, Configuration]>
	removeSuperUser: ({
		id
	}: {
		id: string
		config_id: string
	}) => Promise<[ErrTypes, null] | [null, Configuration]>
	getConfiguration: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, Configuration]>
}
