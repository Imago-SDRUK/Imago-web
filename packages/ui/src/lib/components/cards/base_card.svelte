<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fly } from 'svelte/transition'
	type Props = {
		children: Snippet
		border?: boolean
		border_size?: 'default' | 'thick'
		rounded?: boolean
		shadow?: boolean
		style?: 'default' | 'padded' | 'even-padded'
		size?: 'sm' | 'md' | 'lg' | 'base'
		overflow?: boolean
		hover?: 'default' | 'option'
		selected?: boolean
	}
	let {
		children,
		border,
		style = 'default',
		rounded,
		size = 'base',
		shadow,
		border_size = 'default',
		hover = 'default',
		overflow,
		selected
	}: Props = $props()
</script>

<div
	class="card"
	data-style={style}
	data-size={size}
	data-hover={hover}
	data-overflow={overflow ? true : undefined}
	data-border-size={border_size}
	class:border
	class:rounded
	class:shadow
	class:selected
	in:fly|global={{ y: 40 }}
>
	{@render children()}
</div>

<style>
	.card {
		overflow: hidden;
		transition: all var(--animation-time) ease-in-out;
	}
	.selected {
		border: 2px solid var(--quarternary) !important;
		background-color: var(--quinary-selected);
	}
	.border {
		border: 1px solid var(--border-muted);
	}
	.border:hover:not(.selected) {
		border: 1px solid var(--border);
	}
	.border[data-border-size='thick'] {
		border: 2px solid var(--border-accent);
	}
	.border[data-border-size='thick']:hover:not(.selected) {
		border: 2px solid;
	}
	.rounded {
		border-radius: var(--radius);
	}
	.shadow {
		box-shadow: var(--glass);
	}
	.card[data-style='padded'] {
		padding: 2rem;
	}
	.card[data-style='even-padded'] {
		padding: 2rem;
		aspect-ratio: 1 / 1;
	}
	.card[data-style='even'] {
		aspect-ratio: 1 / 1;
	}
	.card[data-size='sm'] {
		width: min(100% - 1rem, 400px);
	}
	.card[data-size='md'] {
		width: min(100% - 1rem, 500px);
	}
	.card[data-size='lg'] {
		width: min(100% - 1rem, 600px);
	}
	.card[data-size='base'] {
		width: min(100%);
	}
	.card[data-overflow] {
		overflow: initial;
	}
	.card[data-hover='option']:hover {
		cursor: pointer;
	}
	.card[data-hover='option']:hover:not(.selected) {
		border-color:  var(--quarternary);
		background-color: var(--secondary-muted);
	}
</style>
