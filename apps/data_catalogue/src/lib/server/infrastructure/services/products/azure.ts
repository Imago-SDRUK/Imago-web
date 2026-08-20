import type { IProductsService } from '$lib/server/application/services/products'
import { err, ok } from '$lib/server/entities/errors'
import { env } from '$env/dynamic/private'
import {
	ContainerInstanceManagementClient,
	type ContainerGroup
} from '@azure/arm-containerinstance'
import { DefaultAzureCredential } from '@azure/identity'
import { log } from '$lib/utils/server/logger'

//NOTE: the host must have the az client installed and authenticated as IT is blocking managed identities....
//function getAzureCliToken() {
//	const command = 'az account get-access-token --output json'
//	const output = execSync(command, { encoding: 'utf-8' })
//	const json = JSON.parse(output)
//	return json.accessToken
//}

// 	// NOTE: if you create a Microsoft Entra ID...
// 	// if ('PIPELINE_AZURE_AUTH_MODE' === 'managed_identity') {
// 	// 	// if (env.PIPELINE_AZURE_CLIENT_ID) {
// 	// 	return new ContainerInstanceManagementClient(
// 	// 		new ManagedIdentityCredential({
// 	// 			clientId: "PIPELINE_AZURE_CLIENT_ID"
// 	// 		}),
// 	// 		server_envs.PIPELINE_AZURE_SUBSCRIPTION_ID
// 	// 	)
// 	// 	// }
// 	// 	// log.debug(`PIPELINE_AZURE_CLIENT_ID is not defined, defaulting to default azure credentials`)
// 	// }

const client = new ContainerInstanceManagementClient(
	new DefaultAzureCredential(),
	env.PIPELINE_AZURE_SUBSCRIPTION_ID
)

const requestPipeline: IProductsService['requestPipeline'] = async ({ data }) => {
	try {
		const configuration: ContainerGroup = {
			location: env.PIPELINE_AZURE_LOCATION,
			containers: [
				{
					name: `${env.PIPELINE_AZURE_CONTAINER_GROUP}-${data.id}`,
					image: data.image,
					resources: {
						requests: { cpu: 4, memoryInGB: 10 }
					},
					environmentVariables: data.environment_variables.map(({ key, value }) => ({
						name: key,
						value
					}))
				}
			],
			imageRegistryCredentials: [
				{
					server: env.PIPELINE_DOCKER_REGISTRY_SERVER,
					username: env.PIPELINE_DOCKER_REGISTRY_USERNAME,
					password: env.PIPELINE_DOCKER_REGISTRY_PASSWORD
				}
			],
			osType: env.PIPELINE_AZURE_OS_TYPE,
			restartPolicy: env.PIPELINE_AZURE_RESTART_POLICY
			// TODO: networking
			// ipAddress: {
			// 	type: 'Private',
			// 	ports: [{ port: 80, protocol: 'TCP' }]
			// },
			// subnetIds: [
			// 	{
			// 		id: `/subscriptions/${env.PIPELINE_AZURE_SUBSCRIPTION_ID}/resourceGroups/${env.PIPELINE_AZURE_RESOURCE_GROUP}/providers/Microsoft.Network/virtualNetworks/${env.PIPELINE_AZURE_VNET}/subnets/${env.PIPELINE_AZURE_SUBNET}`
			// 	}
			// ]
		}
		const res = await client.containerGroups.beginCreateOrUpdateAndWait(
			env.PIPELINE_AZURE_RESOURCE_GROUP,
			`${env.PIPELINE_AZURE_CONTAINER_GROUP}-${data.id}`,
			configuration
		)
		return ok({
			active: res.provisioningState,
			fqdn: res.ipAddress?.fqdn ?? null,
			instance_events: JSON.stringify(res.instanceView?.events) ?? null,
			instance_state: res.instanceView?.state ?? null,
			location: res.location ?? null,
			ip: res.ipAddress?.ip ?? null
		})
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const getPipeline: IProductsService['getPipeline'] = async ({ id }) => {
	try {
		const res = await client.containerGroups.get(
			env.PIPELINE_AZURE_RESOURCE_GROUP,
			`${env.PIPELINE_AZURE_CONTAINER_GROUP}-${id}`
		)
		return ok({
			active: res.provisioningState,
			fqdn: res.ipAddress?.fqdn ?? null,
			instance_events: JSON.stringify(res.instanceView?.events) ?? null,
			instance_state: res.instanceView?.state ?? null,
			location: res.location ?? null,
			ip: res.ipAddress?.ip ?? null
		})
	} catch (_err) {
		log.debug(`error getting the pipeline - azure`)
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const deletePipeline: IProductsService['deletePipeline'] = async ({ id }) => {
	try {
		/**
		 * Check if the container group exists, if it thows an err it will be caught and return false
		 **/
		const res = await client.containerGroups.beginDelete(
			env.PIPELINE_AZURE_RESOURCE_GROUP,
			`${env.PIPELINE_AZURE_CONTAINER_GROUP}-${id}`
		)
		console.log(res)
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const productsServiceInfrastructureAzure: IProductsService = {
	getPipeline,
	requestPipeline,
	deletePipeline
}
