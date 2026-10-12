import type { IProductsService } from '$lib/server/application/services/products'
import { log } from '$lib/utils/server/logger'
import { err, ok } from '$lib/server/entities/errors'
import Docker from 'dockerode'
import { env } from '$env/dynamic/private'

const generateContainerName = (id: string) => `imago-pipeline-${id}`

const client = new Docker(
	env.PIPELINE_LOCAL_SOCKET
		? {
				socketPath: env.PIPELINE_LOCAL_SOCKET
			}
		: {
				host: env.PIPELINE_LOCAL_HOST,
				port: env.PIPELINE_LOCAL_PORT
			}
)

const ping = async () => {
	try {
		const p = await client.ping()
		console.log('ping is ok')
		return ok(p)
	} catch (_err) {
		console.log('ping is not ok :(')
		return err({
			reason: 'Unexpected',
			error: `Docker is unreachable, please check your configuration - ${_err}`,
			id: ''
		})
	}
}

const checkDockerImageExists = async ({ image }: { image: string }): Promise<boolean> => {
	try {
		await client.getImage(image).inspect()
		return true
	} catch {
		return false
	}
}

const getPipeline: IProductsService['getPipeline'] = async ({ id }) => {
	try {
		const [ping_err] = await ping()
		if (ping_err !== null) {
			return err(ping_err)
		}
		const res = client.getContainer(generateContainerName(id))
		const a = await res.inspect()
		return ok(a)
	} catch (_err) {
		if (
			typeof _err === 'object' &&
			_err &&
			'statusCode' in _err &&
			typeof _err.statusCode === 'number'
		) {
			if (_err.statusCode === 404) {
				return err({ reason: 'Not Found', message: `Container could't be found` })
			}
		}
		return err({ reason: 'Unexpected', error: _err })
	}
}

const requestPipeline: IProductsService['requestPipeline'] = async ({ data }) => {
	try {
		const [ping_err] = await ping()
		if (ping_err !== null) {
			return err(ping_err)
		}
		const image_exists = await checkDockerImageExists({
			image: data.image
		})
		if (image_exists !== true) {
			return err({ reason: 'Not Found', message: 'The requested pipeline image does not exist' })
		}
		log.debug('passed docker image check')
		const container_config: Docker.ContainerCreateOptions = {
			name: generateContainerName(data.id),
			Image: data.image,
			// Cmd: [],
			HostConfig: {
				// Binds: [],
				// PortBindings: {
				// 	'80': [{ HostPort: '80' }]
				// }
			},
			NetworkingConfig: {
				EndpointsConfig: {
					subnet: {}
				}
			},
			Env: data.environment_variables.map(({ key, value }) => `${key}=${value}`)
		}
		log.debug(container_config)
		const container = await client.createContainer(container_config)
		log.debug(`container created`)
		await container.start()
		log.debug(`container started`)
		return ok(null)
	} catch (_err) {
		console.log(`Failed initialising`)
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deletePipeline: IProductsService['deletePipeline'] = async ({ id }) => {
	try {
		const [ping_err] = await ping()
		if (ping_err !== null) {
			return err(ping_err)
		}
		const container = client.getContainer(generateContainerName(id))
		const [stop_errors] = await container
			.stop()
			.then(() => {
				return ok(null)
			})
			.catch((_err) => {
				if (_err['reason'] === 'container already stopped') {
					return ok(null)
				}
				return err({ reason: 'Unexpected', error: _err })
			})
		if (stop_errors !== null) {
			return err(stop_errors)
		}
		await container.remove()
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const productsServiceInfrastructureLocal: IProductsService = {
	getPipeline,
	requestPipeline,
	deletePipeline
}
