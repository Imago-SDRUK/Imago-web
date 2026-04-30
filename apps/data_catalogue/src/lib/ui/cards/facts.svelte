<script lang="ts" generics="T extends Record<PropertyKey, unknown>">
	import { capitalise } from '@arturoguzman/art-ui'
	import { Paragraph } from '@imago/ui'
	let { record, keys }: { record: T; keys?: (keyof T)[] } = $props()
	const _keys = $derived(keys ?? Object.keys(record))
</script>

{#if typeof record === 'object' && record && !Array.isArray(record)}
	<div class="facts">
		{#each _keys as key}
			<div class="fact">
				<Paragraph>{typeof key === 'string' ? capitalise(key) : key}</Paragraph>
				<Paragraph size="xs">{record[key] ?? '-'}</Paragraph>
			</div>
		{/each}
	</div>
{/if}

<style>
	.facts {
		display: grid;
		gap: 0.25rem 1rem;
		grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
		grid-auto-flow: row;
		background-color: var(--background-muted);
		padding: 1rem;
		border-radius: var(--radius);
	}
	.fact {
		display: grid;
		grid-column: 1 / 3;
		grid-template-columns: subgrid;
	}
</style>
