<script lang="ts" generics="T extends Record<PropertyKey, unknown>">
	import { fuzzy } from '@arturoguzman/art-ui'
	import { Notice, Text, Paragraph } from '@imago/ui'
	import type { Snippet } from 'svelte'

	let {
		data,
		key,
		result
	}: {
		data: T[]
		result: Snippet<[{ result: T; index: number; clear: () => void }]>
		key: keyof T
	} = $props()
	let search = $state('')
	const results = $derived(data.filter((actor) => fuzzy(search, String(actor[key]))))
	const clear = () => (search = '')
</script>

<div class="search">
	<div class="search-bar">
		<Text placeholder="Search" name="search" bind:value={search}></Text>
	</div>
	{#if search !== ''}
		<div class="results">
			{#each results as _result, index (_result)}
				{@render result?.({ result: _result, index, clear })}
			{/each}
			{#if results.length === 0}
				<Notice level="info">
					<Paragraph size="xs">No results for {search}</Paragraph>
				</Notice>
			{/if}
		</div>
	{/if}
</div>

<style>
</style>
