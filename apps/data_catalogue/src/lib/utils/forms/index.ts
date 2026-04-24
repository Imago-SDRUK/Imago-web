import { applyAction } from '$app/forms'
import { goto, invalidateAll } from '$app/navigation'
import { APP_STATE } from '$lib/globals/state.svelte'
import { notify } from '$lib/stores/notify'
import type { ActionResult } from '@sveltejs/kit'

const arr_regex = /\[[0-9]+\]/i

export const parseForm = (form: FormData) => {
	const result: Record<PropertyKey, unknown | unknown[]> = {}
	form.forEach((value, key) => {
		const split = key.split('.')
		if (split.length > 1) {
			//@ts-expect-error ok ok ok
			split.reduce((acc, key, index) => {
				if (typeof acc !== 'object') {
					return acc
				}
				const clean: Record<PropertyKey, unknown | unknown[]> = {}
				if (acc && key in acc) {
					if (index === split.length - 1) {
						handleArray(acc, key, value)
					}
					return acc[key]
				}
				acc[key] = clean
				if (index === split.length - 1) {
					acc[key] = value
				}
				return acc[key]
			}, result)
		}
		if (split.length === 1) {
			if (key in result === false) {
				result[key] = value
				return
			}
			handleArray(result, key, value)
		}
	})
	return parseObject(result)
}

// const a = {
// 	data: {
// 		status: 'draft',
// 		preferences: {
// 			notifications: 'ioasjdfoi',
// 			random: {
// 				testing: 'ihoihdfoiahsdoih'
// 			}
// 		},
// 		test: {
// 			random: {
// 				testing: 'joi'
// 			},
// 			ok: ['oih', 'oi']
// 		},
// 		admit: ['hopi', 'hpoihasdfoih'],
// 		tags: {
// 			'[1]': {
// 				key: 'hoihoiahsdfoiho',
// 				value: 'hoiashdofih'
// 			},
// 			'[2]': {
// 				key: 'oihoihid',
// 				value: 'ihsaidhfiashdf'
// 			}
// 		},
// 		email: 'test@test.com',
// 		name: 'test'
// 	}
// }

const handleArray = (
	result: Record<PropertyKey, unknown | unknown[]>,
	key: string,
	value: FormDataEntryValue
) => {
	if (!Array.isArray(result[key])) {
		result[key] = [result[key]]
	}
	if (Array.isArray(result[key])) {
		result[key].push(value)
	}
}

const parseObject = (result: Record<PropertyKey, unknown | unknown[]>) =>
	Object.fromEntries(
		Object.entries(result).reduce((acc, entry) => {
			if (typeof entry[1] !== 'object') {
				//@ts-expect-error ok ok ok
				acc.push(entry)
				return acc
			}
			if (Array.isArray(entry[1])) {
				//@ts-expect-error ok ok ok
				acc.push(entry)
				return acc
			}
			if (entry[1] === null) {
				//@ts-expect-error ok ok ok
				acc.push(entry)
				return acc
			}
			if (Object.keys(entry[1]).every((key) => arr_regex.test(key))) {
				const arr = Object.values(entry[1])
				//@ts-expect-error ok ok ok
				acc.push([entry[0], arr])
				return acc
			}
			//@ts-expect-error ok ok ok
			acc.push([entry[0], parseObject(entry[1])])
			return acc
		}, [])
	)

export const formGetStringOrNull = ({ form, field }: { form: FormData; field: string }) => {
	const value = form.get(field)
	if (typeof value !== 'string') {
		return null
	}
	return value
}

export const formGetStringOrUndefined = ({ form, field }: { form: FormData; field: string }) => {
	const value = form.get(field)
	if (typeof value !== 'string') {
		return undefined
	}
	return value
}

export const safeJSONParse = (value?: string) => {
	try {
		if (value) {
			return JSON.parse(value)
		}
		return null
	} catch (err) {
		console.log(err)
		return null
	}
}

export const formGetNumberOrUndefined = ({ form, field }: { form: FormData; field: string }) => {
	const value = form.get(field)
	if (typeof value !== 'string') {
		return undefined
	}
	return Number(value)
}

type FormPreSubmit = {
	action: URL
	formData: FormData
	formElement: HTMLFormElement
	controller: AbortController
	submitter: HTMLElement | null
	cancel: () => void
}

type FormResponse = {
	formData: FormData
	formElement: HTMLFormElement
	action: URL
	result: ActionResult<Record<string, unknown> | undefined, Record<string, unknown> | undefined>
	update: (options?: { reset?: boolean; invalidateAll?: boolean }) => Promise<void>
}

type HandleEnhanceParams = {
	onsubmit?: (params: FormPreSubmit) => void | Promise<void>
	onerror?: (params: FormResponse) => void | Promise<void>
	onfailure?: (params: FormResponse) => void | Promise<void>
	onsuccess?: (params: FormResponse) => void | Promise<void>
	onredirect?: (params: FormResponse) => void | Promise<void>
}

export const handleEnhance = (_params?: HandleEnhanceParams) => (params: FormPreSubmit) => {
	APP_STATE.loading = true
	_params?.onsubmit?.(params)
	return async ({ formData, formElement, action, result, update }: FormResponse) => {
		APP_STATE.loading = false
		if (result.type === 'error') {
			await _params?.onerror?.({ formData, formElement, action, result, update })
			notify.send({ message: result.error.message })
		}
		if (result.type === 'failure') {
			await _params?.onfailure?.({ formData, formElement, action, result, update })
			if (result.data?.message && typeof result.data.message === 'string') {
				notify.send({ message: result.data?.message })
			}
		}
		if (result.type === 'success') {
			await _params?.onsuccess?.({ formData, formElement, action, result, update })
			if (result.data?.message && typeof result.data.message === 'string') {
				notify.send({ message: result.data?.message })
			}
		}
		if (result.type === 'redirect') {
			await _params?.onredirect?.({ formData, formElement, action, result, update })
			goto(result.location)
			return
		}
		await applyAction(result)
		await invalidateAll()
	}
}
