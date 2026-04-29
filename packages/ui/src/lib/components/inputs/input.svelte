<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { InputComponentProps } from './types'
	import InputLabel from './input_label.svelte'
	import { Icon } from '$lib/icons'
	let {
		id,
		layout = 'default',
		style = 'border',
		information,
		label_size = 'md',
		label,
		children,
		required,
		message,
		subgrid
	}: InputComponentProps & { children: Snippet<[string]> } = $props()
</script>

<div
	class="input-layout"
	data-layout={layout}
	data-message={message ? true : undefined}
	data-subgrid={subgrid ? true : undefined}
>
	{#if label}
		<div class="label">
			<InputLabel {required} {id} {label} {label_size}></InputLabel>
			{#if information}
				<div class="information-icon" data-information={information}>
					<Icon icon={{ set: 'tabler', icon: 'info-circle' }}></Icon>
				</div>
			{/if}
		</div>
	{/if}
	<div class="bottom-row">
		{#if message}
			<div class="message">
				{@render message()}
			</div>
		{/if}
		<div class="input" data-style={style} data-message={message ? true : undefined}>
			{@render children?.(id ?? '')}
		</div>
	</div>
</div>

<style>
	.input-layout {
		width: 100%;
	}
	.input-layout[data-layout='default'] > *,
	.input-layout[data-layout='default'] > .bottom-row > * {
		margin-bottom: 0.35rem;
	}
	.input-layout[data-layout='default'] > *:last-child,
	.input-layout[data-layout='default'] > .bottom-row > *:last-child {
		margin-bottom: 0;
	}
	.input-layout[data-layout='horizontal'] {
		display: grid;
		grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr);
		align-items: center;
		gap: 0.35rem 1rem;
	}
	.input-layout[data-layout='horizontal'][data-message] {
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr) minmax(0, max-content);
	}
	.input-layout[data-layout='horizontal'][data-message] > .bottom-row {
		display: grid;
		grid-template-columns: minmax(0, 400px) minmax(max-content, 1fr);
		grid-template-rows: minmax(0, 1fr);
		gap: 2rem;
	}

	.input-layout[data-subgrid] {
		display: grid;
		grid-column: 1 / -1;
		grid-template-columns: subgrid;
	}
	.label {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		position: relative;
	}
	.information-icon {
		color: var(--text-muted);
		display: flex;
		align-items: center;
		gap: 0.25rem;
		position: relative;
	}

	.information-icon:hover {
		color: color-mix(in oklab, var(--text) 60%, var(--background) 40%);
		font-weight: 300;
	}
	.information-icon:hover::after {
		content: attr(data-information);
		color: var(--text);
		font-family: var(--paragraph);
		font-size: 0.75rem;
		position: absolute;
		top: 50%;
		left: calc(100% + 0.35rem);
		transform: translate(0%, -50%);
		background-color: var(--background);
		width: max(100%, 25lvw);
		z-index: 1;
	}
	.input {
		overflow: hidden;
		box-sizing: content-box;
		color: var(--text);
	}
	.message {
		font-size: clamp(0.685rem, 0.652rem + 0.167vw, 0.785rem);
		font-weight: 300;
		font-family: var(--paragraph);
		overflow: hidden;
	}
</style>
