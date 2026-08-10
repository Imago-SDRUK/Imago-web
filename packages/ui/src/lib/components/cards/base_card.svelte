<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fly } from 'svelte/transition'
	type Props = {
		children: Snippet
		border?: boolean
		rounded?: boolean
		shadow?: boolean
		style?: 'default' | 'padded' | 'even-padded'
		size?: 'sm' | 'md' | 'lg' | 'base'
		overflow?: boolean
	}
	let {
		children,
		border,
		style = 'default',
		rounded,
		size = 'base',
		shadow,
		overflow
	}: Props = $props()
</script>

<div
	class="card"
	data-style={style}
	data-size={size}
	data-overflow={overflow ? true : undefined}
	class:border
	class:rounded
	class:shadow
	in:fly|global={{ y: 40 }}
>
	{@render children()}
</div>

<style>
	.card {
		overflow: hidden;
		transition: all var(--animation-time) ease-in-out;
	}
	.border {
		border: 1px solid var(--border-muted);
	}
	.border:hover {
		border: 1px solid var(--border);
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
</style>
