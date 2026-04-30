<script lang="ts">
	import { Select } from 'melt/builders'
	import Input from './input.svelte'
	import type { InputSelectProps } from './types'
	import { Paragraph } from '../text'
	import Button from '../buttons/button.svelte'
	let {
		value = $bindable(),
		id,
		name,
		children,
		disabled = false,
		options = [],
		placeholder = 'Select an option',
		multiple
	}: InputSelectProps = $props()
	const handleChange = (val?: string | Set<string>) => {
		if (multiple && val instanceof Set) {
			value = Array.from(val)
			return
		}
		value = val
	}
	const select = new Select<string>({
		multiple,
		onValueChange: handleChange
	})
	const getLabel = (val?: string | string[]) => {
		if (Array.isArray(val)) {
			if (val.length === 0) return placeholder
			return val.map((v) => options.find((opt) => opt.value === v)?.label ?? v).join(', ')
		}
		if (val === '') return placeholder
		if (val === null) return placeholder
		return options.find((opt) => opt.value === val)?.label ?? val
	}
	const getActive = (val: string | string[], opt: string) => {
		if (Array.isArray(val)) {
			return val.includes(opt)
		}
		return val === opt
	}
</script>

<Input {id}>
	<input type="hidden" {value} {name} />
	<button type="button" class="trigger" {...select.trigger} data-style="base" {disabled}>
		<Paragraph style="full-width" align="left" text={getLabel(value)} current_colour></Paragraph>
	</button>
	<div class="select" {...select.content}>
		{#each options as option}
			<Button
				style="clean"
				type="button"
				{...select.getOption(option.value)}
				active={getActive(value, option.value)}
			>
				<Paragraph size="xs" current_colour>
					{option.label}
				</Paragraph>
			</Button>
		{/each}
		{@render children?.()}
	</div>
</Input>

<style>
	.trigger {
		display: flex;
		color: var(--highlight);
		font-family: var(--accent);
		font-weight: 300;
		transition: all var(--animation-time) ease-in-out;
		text-decoration: none;
		width: 100%;
		background-color: var(--background);
	}

	.trigger {
		border: 1px solid var(--border);
		padding: 0.5rem 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius);
		gap: var(--padding-xl);
	}
	.trigger:hover {
		border: 1px solid var(--border-muted);
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: var(--radius);
	}

	.select[data-open] {
		border-radius: var(--radius);
		padding: 1rem;
		border: 1px solid var(--border);
		/* transition: all 0.3s ease-in-out; */
		color: currentColor;
		width: 100%;
		background-color: var(--background-muted);
		display: grid;
		gap: 0.5rem;
	}

	.radio-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.radio-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}
</style>
