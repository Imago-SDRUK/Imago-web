import type { IconsSets } from '$lib/icons'
import type { Snippet } from 'svelte'
import type {
	FocusEventHandler,
	HTMLInputAttributes,
	HTMLTextareaAttributes,
	KeyboardEventHandler
} from 'svelte/elements'

export type BaseInputProps = {
	id?: string
	required?: boolean
	placeholder?: string
	disabled?: boolean
}

export type InputComponentProps = {
	id?: string
	layout?: 'default' | 'horizontal' | 'description'
	label?: string
	required?: boolean
	label_size?: 'sm' | 'md' | 'lg'
	style?: 'border' | 'floating'
	information?: string
	width?: 'auto' | 'full'
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
	current_colour?: boolean
	value?: number
} & Omit<HTMLInputAttributes, 'popover' | 'type'> &
	InputComponentProps

export type BaseNumberInputProps = {
	name?: string
	'aria-invalid'?: boolean | 'false' | 'true' | undefined
	value?: string | number | null
	min?: number
	max?: number
	step?: number
	onfocusin?: FocusEventHandler<HTMLInputElement>
	onfocusout?: FocusEventHandler<HTMLInputElement>
	onkeydown?: KeyboardEventHandler<HTMLInputElement>
	onkeyup?: KeyboardEventHandler<HTMLInputElement>
	onblur?: FocusEventHandler<HTMLInputElement>
	current_colour?: boolean
	buttons?: boolean
} & BaseInputProps

export type InputDateProps = {
	time?: boolean
	width?: 'auto' | 'full'
} & Omit<HTMLInputAttributes, 'popover'>

export type InputSelectProps = {
	name?: string
	children?: Snippet
	options?: { label: string; value: string | null }[]
	disabled?: boolean
	placeholder?: string
	design_type?: 'dropdown' | 'list'
	debug?: boolean
	multiple?: boolean
	value?: string | string[]
	same_width?: boolean
	onchange?: (value?: string | Set<string> | null) => void
} & InputComponentProps
// } & Omit<HTMLInputAttributes, 'popover'> &
