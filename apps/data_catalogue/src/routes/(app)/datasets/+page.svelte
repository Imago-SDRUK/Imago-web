<script lang="ts">
	import { debug } from '$lib/globals/dev.svelte.js'
	import { BaseSection, Button, handleSearchParams, Icon, Paragraph, Subtitle } from '@imago/ui'
	import { page } from '$app/state'
	import Filters from '$lib/ui/dataset/filters.svelte'
	import CardProduct from '$lib/ui/cards/card_product.svelte'
	let { data } = $props()
	let datasets = $derived(data.datasets.items)
	debug.data = data
</script>

<BaseSection>
	<!-- <Banner text="There are no datasets available."></Banner> -->
	<div class="datasets-section">
		<div class="left-col">
			<Filters
				organisations={data.organisations}
				tags={data.tags}
				licenses={data.licenses}
				groups={data.groups}
				resources={data.resources}
			></Filters>
		</div>
		<div class="right-col">
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
		grid-template-columns: minmax(0, 1fr) minmax(0, 4fr);
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
</style>
