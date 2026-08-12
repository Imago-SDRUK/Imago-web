import type { IProductsRepository } from '$lib/server/application/repositories/products'
import { err, ok } from '$lib/server/entities/errors'
import { eq, inArray } from 'drizzle-orm'
import { db } from '$lib/db'
import { products } from '$lib/db/schema'

const createProduct: IProductsRepository['createProduct'] = async ({ data, tx }) => {
	try {
		const _db = tx ?? db
		const product = await _db.insert(products).values(data).returning()
		if (product.length === 1) {
			return ok(product[0])
		}
		return err({ reason: 'Not Found', message: 'Product not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const deleteProduct: IProductsRepository['deleteProduct'] = async ({ id, tx }) => {
	try {
		const _db = tx ?? db
		await _db.delete(products).where(eq(products.id, id))
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getProduct: IProductsRepository['getProduct'] = async ({ id, tx }) => {
	try {
		const _db = tx ?? db
		const product = await _db.select().from(products).where(eq(products.id, id))
		if (product.length === 1) {
			return ok(product[0])
		}
		return err({ reason: 'Not Found', message: 'Product not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const listProducts: IProductsRepository['listProducts'] = async ({ tx, limit, offset, ids }) => {
	try {
		const _db = tx ?? db
		// TODO: add pagination
		const results = await _db
			.select()
			.from(products)
			.where(ids ? inArray(products.id, ids) : undefined)
		return ok({ limit, offset, items: results, total: results.length })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateProduct: IProductsRepository['updateProduct'] = async ({ tx, id, data }) => {
	try {
		const _db = tx ?? db
		const product = await _db.update(products).set(data).where(eq(products.id, id)).returning()
		if (product.length === 1) {
			return ok(product[0])
		}
		return err({ reason: 'Not Found', message: 'Product not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const drizzleIProductsRepositoryInfrastructure: IProductsRepository = {
	createProduct,
	deleteProduct,
	getProduct,
	listProducts,
	updateProduct
}
