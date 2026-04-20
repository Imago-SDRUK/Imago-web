<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		children,
		level
	}: { children: Snippet; level: 'warning' | 'negative' | 'positive' | 'danger' | 'info' } =
		$props()
</script>

<div class="notice-pill" data-level={level}>
	{@render children()}
</div>

<style>
	.notice-pill {
		color: var(--background-muted);
		padding: 0.25rem 1rem;
		border-radius: var(--radius);
	}
	.notice-pill[data-level='warning'] {
		background-color: var(--warning);
	}
	.notice-pill[data-level='negative'] {
		background-color: var(--negative);
	}
	.notice-pill[data-level='positive'] {
		background-color: var(--positive);
	}
	.notice-pill[data-level='danger'] {
		background-color: var(--danger);
	}
	.notice-pill[data-level='info'] {
		background-color: var(--background-muted);
	}
</style>
