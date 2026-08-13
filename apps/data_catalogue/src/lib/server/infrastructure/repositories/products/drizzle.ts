import type { IProductsRepository } from '$lib/server/application/repositories/products'
import { err, ok } from '$lib/server/entities/errors'
import { eq, inArray } from 'drizzle-orm'
import { db } from '$lib/db'
import { product_options, products } from '$lib/db/schema'

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

const createProductOption: IProductsRepository['createProductOption'] = async ({ data, tx }) => {
	try {
		const _db = tx ?? db
		const product = await _db.insert(product_options).values(data).returning()
		if (product.length === 1) {
			return ok(product[0])
		}
		return err({ reason: 'Not Found', message: 'Product not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const deleteProductOption: IProductsRepository['deleteProductOption'] = async ({ id, tx }) => {
	try {
		const _db = tx ?? db
		await _db.delete(product_options).where(eq(product_options.id, id))
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getProductOption: IProductsRepository['getProductOption'] = async ({ id, tx }) => {
	try {
		const _db = tx ?? db
		const product = await _db.select().from(product_options).where(eq(product_options.id, id))
		if (product.length === 1) {
			return ok(product[0])
		}
		return err({ reason: 'Not Found', message: 'Product not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const listProductOptions: IProductsRepository['listProductOptions'] = async ({
	tx,
	limit,
	offset,
	ids
}) => {
	try {
		const _db = tx ?? db
		// TODO: add pagination
		const results = await _db
			.select()
			.from(product_options)
			.where(ids ? inArray(product_options.id, ids) : undefined)
		return ok({ limit, offset, items: results, total: results.length })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateProductOption: IProductsRepository['updateProductOption'] = async ({
	tx,
	id,
	data
}) => {
	try {
		const _db = tx ?? db
		const product = await _db
			.update(product_options)
			.set(data)
			.where(eq(product_options.id, id))
			.returning()
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
	updateProduct,
	createProductOption,
	deleteProductOption,
	getProductOption,
	listProductOptions,
	updateProductOption
}
