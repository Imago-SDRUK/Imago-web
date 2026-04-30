import { configure } from 'arktype/config'
configure({ onUndeclaredKey: 'delete' })
import { ArkErrors, type } from 'arktype'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-arktype'
import type { TableConfig } from 'drizzle-orm'
import type { PgTableWithColumns } from 'drizzle-orm/pg-core'

export type ArkFormErrors = { success: false; errors: Record<PropertyKey, string> }

export const handleArkErrors = (parsed: ArkErrors): ArkFormErrors => {
	const errors = [...parsed.entries()].reduce(
		(acc, err) => {
			acc[err[1].path[0]] = err[1].problem
			return acc
		},
		{} as Record<PropertyKey, string>
	)
	return {
		success: false,
		errors: errors
	}
}

export const validateSelect = <T extends TableConfig>(
	schema: PgTableWithColumns<T>,
	record: unknown
) => {
	const _schema = createSelectSchema(schema)
	const parsed = _schema(record)
	if (parsed instanceof type.errors) {
		return handleArkErrors(parsed)
	}
	return {
		success: true as const,
		data: parsed
	}
}

export const validateInsert = <T extends TableConfig>(
	schema: PgTableWithColumns<T>,
	record: unknown
) => {
	const _schema = createInsertSchema(schema)
	const parsed = _schema(record)
	if (parsed instanceof type.errors) {
		return handleArkErrors(parsed)
	}
	return {
		success: true as const,
		data: parsed
	}
}

export const validateUpdate = <T extends TableConfig>(
	schema: PgTableWithColumns<T>,
	record: Record<PropertyKey, unknown>
) => {
	const _schema = createUpdateSchema(schema)
	const parsed = _schema(record)
	if (parsed instanceof type.errors) {
		return handleArkErrors(parsed)
	}
	return {
		success: true as const,
		data: parsed
	}
}
