import type { IProductsRepository } from '$lib/server/application/repositories/products'
import type { IProductsService } from '$lib/server/application/services/products'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import { getProductsServiceModule } from '$lib/server/modules/products_service'

type ResolveById = {
	id: string | null
	products_repository: IProductsRepository
}
type ResolveByType = { type: 'local' | 'azure' }
type ResolveParams = ResolveByType | ResolveById

export type IProductResourcesResolver = {
	resolve: (params: ResolveParams) => Promise<[ErrTypes, null] | [null, IProductsService]>
}

const resolve: IProductResourcesResolver['resolve'] = async (params) => {
	if ('type' in params) {
		return ok(getProductsServiceModule(params.type))
	}
	if (!params.id) {
		return err({
			reason: 'Missing Configuration',
			message: `You need to configure a storage service before perfoming this action.`
		})
	}
	const [errors, resource] = await params.products_repository.getProductResource({ id: params.id })
	if (errors !== null) {
		return err(errors)
	}
	return ok(getProductsServiceModule(resource.pipeline_backend))
}

const storageResolver: IProductResourcesResolver = {
	resolve
}

export const getProductResourcesResolver = () => {
	return storageResolver
}
