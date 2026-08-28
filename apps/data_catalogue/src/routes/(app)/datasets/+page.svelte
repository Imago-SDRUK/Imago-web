<script lang="ts">
	import { debug } from '$lib/globals/dev.svelte.js'
	import { BaseSection, Button, handleSearchParams, Icon, Paragraph, Subtitle } from '@imago/ui'
	import { page } from '$app/state'
	import Filters from '$lib/ui/dataset/filters.svelte'
	import CardProduct from '$lib/ui/cards/card_product.svelte'
	import type { DatasetsFilter } from '$lib/types/filters/index.js'
	let { data } = $props()
	let datasets = $derived(data.datasets.items)
	const filters: DatasetsFilter[] = $derived([
		{
			title: 'Groups',
			filters: data.groups.map((group) =>
				typeof group === 'string'
					? { key: group, value: group }
					: { key: group.title, value: group.name }
			),
			query: 'groups',
			limit: 10
		},
		{
			title: 'Tags',
			filters: data.tags.map((tag) =>
				typeof tag === 'string'
					? { key: tag, value: tag }
					: { key: tag.display_name, value: tag.name }
			),
			// query: 'vocab_Topics',
			query: 'vocab_general',
			limit: 10
		},
		{
			title: 'Resources',
			filters: data.resources.result.map((resource) => ({ key: resource, value: resource })),
			query: 'res_format',
			limit: 10
		}
	])
	const some = $derived(
		filters.filter(
			(filter) =>
				filter.filters.filter((result) =>
					page.url.searchParams.getAll(filter.query).includes(result.value)
				).length > 0
		).length
	)
	debug.data = data
</script>

<BaseSection>
	<!-- <Banner text="There are no datasets available."></Banner> -->
	<div class="datasets-section">
		<div class="left-col">
			<Filters {filters}></Filters>
		</div>
		<div class="right-col">
			{#if some > 0}
				<div class="existing-filters">
					<Subtitle size="sm">Filters:</Subtitle>
					{#each filters as filter}
						{#each filter.filters.filter((result) => page.url.searchParams
								.getAll(filter.query)
								.includes(result.value)) as result}
							<div class="tag-wrapper">
								<!-- {#each filter.filters.result.slice(0, filter.limit) as result} -->
								<!-- {#if typeof result === 'string'} -->
								<!-- 	{@const active = page.url.searchParams.getAll(filter.query).includes(result)} -->
								<!-- 	<Button -->
								<!-- 		style="tag" -->
								<!-- 		{active} -->
								<!-- 		line_clamp -->
								<!-- 		href={handleSearchParams({ -->
								<!-- 			add: [{ key: filter.query, value: result }], -->
								<!-- 			remove: active ? [{ key: filter.query, value: result }] : undefined, -->
								<!-- 			url: page.url -->
								<!-- 		})}>{result}</Button -->
								<!-- 	> -->
								<!-- {/if} -->
								<Button
									style="tag"
									active
									line_clamp
									href={handleSearchParams({
										remove: [{ key: filter.query, value: result.value }],
										url: page.url
									})}>{result.key}</Button
								>
							</div>
						{/each}
					{/each}
					<Button href={page.url.pathname} style="tag">Clear all</Button>
				</div>
			{/if}
			{#if Array.isArray(datasets)}
				{#if datasets.length === 0}
					<Subtitle size="lg">There are no results for this search.</Subtitle>
				{/if}
				{#each datasets as dataset}
					<CardProduct {dataset}></CardProduct>
				{/each}

				<div class="footer">
					{#if data.datasets.total > 0}
						{#if page.url.searchParams.get('offset')}
							{@const offset = Number(page.url.searchParams.get('offset'))}
							<!-- HACK: replace fixed dataset with fn to strip required searchparams -->
							<Button
								href={handleSearchParams({
									url: page.url,
									add: [{ key: 'offset', value: offset - 10, set: true }],
									remove: offset - 10 <= 0 ? ['offset'] : undefined
								})}
							>
								<!-- <Button href={offset - 10 <= 0 ? '/datasets' : `?offset=${offset - 10}`}> -->
								<Icon icon={{ icon: 'arrow-narrow-left', set: 'tabler' }}></Icon>
							</Button>
							<div class="page-count">
								<Paragraph>
									Page {(offset / 10 + 1).toFixed(0)} of
									{Math.ceil(Number(data.datasets.total) / 10)}
								</Paragraph>
							</div>
							{#if offset + 10 < data.datasets.total}
								<Button
									href={handleSearchParams({
										url: page.url,
										add: [{ key: 'offset', value: offset + 10, set: true }]
									})}
								>
									<!-- <Button href={`?offset=${offset + 10}`}> -->
									<Icon icon={{ icon: 'arrow-narrow-right', set: 'tabler' }}></Icon>
								</Button>
							{/if}
						{:else}
							<div class="page-count">
								<Paragraph>
									Page 1 of
									{Math.ceil(Number(data.datasets.total) / 10).toFixed(0) === '0'
										? 1
										: Math.ceil(Number(data.datasets.total) / 10)}
								</Paragraph>
							</div>
							{#if data.datasets.total > 10}
								<div class="button-wrapper">
									<Button
										href={handleSearchParams({
											add: [{ key: 'offset', value: 10 }],
											url: page.url
										})}
									>
										<Icon icon={{ icon: 'arrow-narrow-right', set: 'tabler' }}></Icon>
									</Button>
								</div>
							{/if}
						{/if}
					{/if}
				</div>
			{/if}
		</div>
	</div>
</BaseSection>

<style>
	.datasets-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		/* overflow: hidden; */
		gap: 1rem;
		color: var(--text);
		position: relative;
	}

	.right-col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background-color: var(--background-muted);
		padding: 2rem;
		border-radius: 0.35rem;
	}
	.right-col > .footer {
		display: flex;
		justify-content: space-between;
		position: sticky;
		bottom: 0;
		left: 0;
		background-color: var(--background-muted);
		padding: 1rem;
	}
	.button-wrapper {
		grid-column: 3/4;
	}
	.existing-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		width: 100%;
		align-items: center;
	}
	.tag-wrapper {
		flex-shrink: 0;
	}
	@media (min-width: 768px) {
		.datasets-section {
			grid-template-columns: minmax(0, 1fr) minmax(0, 4fr);
		}
	}
</style>
