import type { IconsSets } from '$lib/icons'
import type { Snippet } from 'svelte'
import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements'

export type InputComponentProps = {
	id?: string
	layout?: 'default' | 'horizontal' | 'description'
	label?: string
	required?: boolean
	label_size?: 'sm' | 'md' | 'lg'
	style?: 'border' | 'floating'
	information?: string
	message?: Snippet
	icon?: IconsSets
	subgrid?: boolean
}

export type InputTextareaProps = Omit<HTMLTextareaAttributes, 'popover'> & InputComponentProps

export type InputTextProps = {
	type?: 'text' | 'email' | 'password'
} & Omit<HTMLInputAttributes, 'popover'> &
	InputComponentProps

export type InputTextAreaProps = Omit<HTMLTextareaAttributes, 'popover'> & InputComponentProps

export type InputNumberProps = {
	buttons?: boolean
} & Omit<HTMLInputAttributes, 'popover' | 'type'> &
	InputComponentProps

export type InputDateProps = {
	time?: boolean
} & Omit<HTMLInputAttributes, 'popover'> &
	InputComponentProps

export type InputSelectProps = {
	children?: Snippet
	options?: { label: string; value: string }[]
	disabled?: boolean
	placeholder?: string
	design_type?: 'dropdown' | 'list'
	debug?: boolean
	multiple?: boolean
	value?: string | string[]
} & Omit<HTMLInputAttributes, 'popover'> &
	InputComponentProps
