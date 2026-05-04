<script lang="ts">
	import type { Snippet } from 'svelte'

	let { header, content }: { header: Snippet; content: Snippet } = $props()
</script>

<div class="section-block">
	<header>
		{@render header?.()}
	</header>
	<div class="content">
		{@render content?.()}
	</div>
</div>

<style>
	.section-block {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid var(--border-muted);
		border-radius: var(--radius);
		overflow: hidden;
		background-color: var(--background-accent);
	}
	header {
		padding: 1rem;
		background-color: var(--background-muted);
	}
	.content {
		padding: 0 1rem 1rem 1rem;
	}
</style>
