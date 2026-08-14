import type { IProductsRepository } from '$lib/server/application/repositories/products'
import { err, ok } from '$lib/server/entities/errors'
import { and, eq, inArray, sql, getTableColumns } from 'drizzle-orm'
import { db } from '$lib/db'
import {
	product_option_groups,
	product_options,
	products,
	products_product_options
} from '$lib/db/schema'
import type { ProductOption } from '$lib/server/entities/models/products'

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
		const product = await _db
			.select({
				id: products.id,
				name: products.name,
				versions: products.versions,
				years: products.years,
				created_by: products.created_by,
				updated_by: products.updated_by,
				created_at: products.created_at,
				updated_at: products.updated_at,
				options: sql<ProductOption[]>`
      coalesce(
        json_agg(
          distinct jsonb_build_object(
            'id', ${product_options.id},
            'name', ${product_options.name},
            'value', ${product_options.value},
            'group_id', ${product_options.group_id}
          )
        ) filter (where ${product_options.id} is not null),
        '[]'::json
      )
    `.as('options')
			})
			.from(products)
			.leftJoin(products_product_options, eq(products.id, products_product_options.product_id))
			.leftJoin(product_options, eq(products_product_options.product_option_id, product_options.id))
			.groupBy(products.id)
			.where(eq(products.id, id))
		if (product.length === 1) {
			const res = product[0]
			return ok(res)
		}
		return err({ reason: 'Not Found', message: 'Product not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getProductOptions: IProductsRepository['getProductOptions'] = async ({ id, tx }) => {
	try {
		const _db = tx ?? db
		const result = await _db
			.select({
				group: product_option_groups.name,
				group_id: product_option_groups.id,
				required: product_option_groups.required,
				multiple: product_option_groups.multiple,
				min_selection: product_option_groups.min_selection,
				max_selection: product_option_groups.max_selection,
				options: sql<ProductOption[]>`
      coalesce(
        json_agg(
          distinct jsonb_build_object(
            'id', ${product_options.id},
            'name', ${product_options.name},
            'value', ${product_options.value}
          )
        ) filter (where ${product_options.id} is not null),
        '[]'::json
      )
    `.as('options')
			})
			.from(products_product_options)
			.where(eq(products_product_options.product_id, id))
			.leftJoin(product_options, eq(product_options.id, products_product_options.product_option_id))
			.leftJoin(product_option_groups, eq(product_options.group_id, product_option_groups.id))
			.groupBy(product_option_groups.id)
		return ok(result)
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
		return err({ reason: 'Not Found', message: 'Product option not found' })
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
		const product = await _db
			.select({
				...getTableColumns(product_options),
				group: product_option_groups.name
			})
			.from(product_options)
			.where(eq(product_options.id, id))
			.leftJoin(product_option_groups, eq(product_option_groups.id, product_options.group_id))
		if (product.length === 1) {
			return ok(product[0])
		}
		return err({ reason: 'Not Found', message: 'Product option not found' })
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
			.select({
				...getTableColumns(product_options),
				group: product_option_groups.name
			})
			.from(product_options)
			.where(ids ? inArray(product_options.id, ids) : undefined)
			.leftJoin(product_option_groups, eq(product_option_groups.id, product_options.group_id))
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
		return err({ reason: 'Not Found', message: 'Product option not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const addOptionToProduct: IProductsRepository['addOptionToProduct'] = async ({ tx, data }) => {
	try {
		const _db = tx ?? db
		const product = await _db
			.insert(products_product_options)
			.values(data)
			.onConflictDoNothing()
			.returning()
		if (product.length === 1) {
			return ok(product[0])
		}
		return err({ reason: 'Not Found', message: 'Relationship not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const removeOptionToProduct: IProductsRepository['removeOptionToProduct'] = async ({
	tx,
	data
}) => {
	try {
		const _db = tx ?? db
		await _db
			.delete(products_product_options)
			.where(
				and(
					eq(products_product_options.product_id, data.product_id),
					eq(products_product_options.product_option_id, data.product_option_id)
				)
			)
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const createProductOptionGroup: IProductsRepository['createProductOptionGroup'] = async ({
	tx,
	data
}) => {
	try {
		const _db = tx ?? db
		const product = await _db.insert(product_option_groups).values(data).returning()
		if (product.length === 1) {
			return ok(product[0])
		}
		return err({ reason: 'Not Found', message: 'Product option not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deleteProductOptionGroup: IProductsRepository['deleteProductOptionGroup'] = async ({
	tx,
	id
}) => {
	try {
		const _db = tx ?? db
		await _db.delete(product_option_groups).where(eq(product_option_groups.id, id))
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getProductOptionGroup: IProductsRepository['getProductOptionGroup'] = async ({ id, tx }) => {
	try {
		const _db = tx ?? db
		const product = await _db
			.select()
			.from(product_option_groups)
			.where(eq(product_option_groups.id, id))
		if (product.length === 1) {
			return ok(product[0])
		}
		return err({ reason: 'Not Found', message: 'Product option not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getProductOptionsByGroup: IProductsRepository['getProductOptionsByGroup'] = async ({
	id,
	tx
}) => {
	try {
		const _db = tx ?? db
		const product = await _db
			.select({
				...getTableColumns(product_option_groups),
				options: sql<ProductOption[]>`
      coalesce(
        json_agg(
          distinct jsonb_build_object(
            'id', ${product_options.id},
            'name', ${product_options.name},
            'value', ${product_options.value},
            'group_id', ${product_options.group_id}
          )
        ) filter (where ${product_options.id} is not null),
        '[]'::json
      )
    `.as('options')
			})
			.from(product_option_groups)
			.leftJoin(product_options, eq(product_option_groups.id, product_options.group_id))
			.groupBy(product_option_groups.id)
			.where(eq(product_option_groups.id, id))
		return ok(product)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const listProductOptionGroups: IProductsRepository['listProductOptionGroups'] = async ({
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
			.from(product_option_groups)
			.where(ids ? inArray(product_option_groups.id, ids) : undefined)
		return ok({ limit, offset, items: results, total: results.length })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateProductOptionGroup: IProductsRepository['updateProductOptionGroup'] = async ({
	tx,
	id,
	data
}) => {
	try {
		const _db = tx ?? db
		const product = await _db
			.update(product_option_groups)
			.set(data)
			.where(eq(product_option_groups.id, id))
			.returning()
		if (product.length === 1) {
			return ok(product[0])
		}
		return err({ reason: 'Not Found', message: 'Product option not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const drizzleIProductsRepositoryInfrastructure: IProductsRepository = {
	createProduct,
	deleteProduct,
	getProduct,
	getProductOptions,
	listProducts,
	updateProduct,
	createProductOption,
	deleteProductOption,
	getProductOption,
	listProductOptions,
	updateProductOption,
	addOptionToProduct,
	removeOptionToProduct,
	createProductOptionGroup,
	deleteProductOptionGroup,
	getProductOptionGroup,
	listProductOptionGroups,
	updateProductOptionGroup,
	getProductOptionsByGroup
}
