<script lang="ts">
	import { page } from '$app/state'
	import type { CkanGroup, CkanResource, CkanTag } from '$lib/types/ckan'
	import type { CkanResult, CkanTextError } from '$lib/utils/ckan/actions'
	import { jstr } from '@arturoguzman/art-ui'
	import { Accordion, Button, handleSearchParams, Icon, Subtitle } from '@imago/ui'
	let {
		// organisations,
		groups,
		tags,
		resources,
		licenses
	}: {
		// organisations: CkanResult | CkanTextError
		groups: CkanGroup[]
		tags: CkanTag[]
		resources: CkanResource[]
		licenses: CkanResult | CkanTextError
	} = $props()
	let filters = $state([
		// {
		// 	title: 'Organisations',
		// 	filters: organisations,
		// 	query: 'organization',
		// 	limit: 10,
		// 	transform: (id: string) => {
		// 		return { label: id, href: `?organization=${id}` }
		// 	}
		// },
		{
			title: 'Groups',
			filters: groups,
			query: 'groups',
			field: 'name',
			limit: 10,
			transform: (id: string) => {
				return { label: id, href: `?groups=${id}` }
			}
		},
		{
			title: 'Tags',
			filters: { result: tags.map((tag) => tag.name) },
			// query: 'vocab_Topics',
			query: 'vocab_general',
			limit: 10,
			field: 'id',
			transform: (id: string) => {
				return { label: id, href: `?tags=${id}` }
			}
		},
		{
			title: 'Resources',
			filters: resources,
			query: 'res_format',
			limit: 10,
			field: 'id',
			transform: (id: string) => {
				return { label: id, href: `?res_format=${id}` }
			}
		},
		{
			title: 'Licenses',
			filters: licenses,
			query: 'license_id',
			limit: 10,
			field: 'id',
			transform: (id: string) => {
				return { label: id, href: `?license_id=${id}` }
			}
		}
	])
</script>

<div class="filters">
	{#if page.url.searchParams.get('search')}
		<Button
			style="tag"
			active={true}
			line_clamp
			href={handleSearchParams({
				remove: ['search'],
				url: page.url
			})}>Clear search</Button
		>
	{/if}
	{#each filters.filter((filter) => filter.filters?.result?.length > 0) as filter}
		<div class="accordion-wrapper">
			<Accordion default_open>
				{#snippet title({ toggleOpen, open })}
					<Button
						style="clean-full"
						onclick={() => {
							toggleOpen()
						}}
					>
						{#snippet leftCol()}
							<Subtitle>{filter.title}</Subtitle>
						{/snippet}
						{#snippet rightCol()}
							<Icon icon={{ icon: open ? 'arrow-down-01' : 'arrow-right-01', set: 'hugeicons' }}
							></Icon>
						{/snippet}
					</Button>
				{/snippet}
				{#if Array.isArray(filter.filters.result)}
					<div class="accordion-buttons">
						{#each filter.filters.result as result}
							<div class="button-wrapper">
								<!-- {#each filter.filters.result.slice(0, filter.limit) as result} -->
								{#if typeof result === 'string'}
									{@const active = page.url.searchParams.getAll(filter.query).includes(result)}
									<Button
										style="tag"
										{active}
										line_clamp
										href={handleSearchParams({
											add: [{ key: filter.query, value: result }],
											remove: active ? [{ key: filter.query, value: result }] : undefined,
											url: page.url
										})}>{result}</Button
									>
								{/if}
								{#if typeof result === 'object'}
									{#if result && 'title' in result}
										{@const active = page.url.searchParams
											.getAll(filter.query)
											.includes(result[filter.field])}
										<Button
											style="tag"
											{active}
											line_clamp
											href={handleSearchParams({
												add: [{ key: filter.query, value: result[filter.field] }],
												remove: active
													? [{ key: filter.query, value: result[filter.field] }]
													: undefined,
												url: page.url
											})}>{result.title}</Button
										>
									{/if}
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</Accordion>
		</div>
	{/each}
</div>

<style>
	.accordion-wrapper {
		margin-bottom: 1rem;
	}
	button {
		color: var(--text);
	}
	.accordion-trigger {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}
	.accordion-buttons {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-auto-flow: row;
		gap: 0.5rem;
		max-height: 50lvh;
		overflow-y: scroll;
		scrollbar-width: none;
		padding: 1rem;
	}
	.filters {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
