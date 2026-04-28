<script lang="ts">
	import { type IApi, type IColumnConfig } from '@svar-ui/svelte-grid'
	import { debug } from '$lib/globals/dev.svelte'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import Notes from '$lib/ui/text/notes.svelte'
	import { jstr } from '@arturoguzman/art-ui'
	import { BaseSection, Button, Subtitle, Icon, Title } from '@imago/ui'
	import type { CSVWColumn } from '$lib/types/csvw.js'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import Facts from '$lib/ui/cards/facts.svelte'

	let { data } = $props()
	let result = $derived(data.resource)

	const columns: (IColumnConfig & { id: keyof CSVWColumn })[] = [
		// {
		// 	id: 'name',
		// 	header: 'Column name',
		// 	cell: CellText
		// },
		{
			id: 'title',
			header: 'Column title',
			cell: CellText
		},
		{
			id: 'description',
			header: 'Description',
			cell: CellText
		},
		{
			id: 'dataType',
			header: 'Type',
			cell: CellText
		},
		{
			id: 'propertyURL',
			header: 'Property URL',
			cell: CellText
		}
	]
	const apiFn = (api: IApi) => {
		api.exec('resize-column', { id: 'title', auto: 'data' })
		api.exec('resize-column', { id: 'description', auto: 'data' })
		api.exec('resize-column', { id: 'propertyURL', auto: 'data' })
	}
</script>

<BaseSection>
	<div class="resource-section">
		<div class="left-col">
			<div class="file-metadata">
				<div class="header">
					{#if 'name' in result}
						<Title size="md">{result.name}</Title>
					{/if}
					{#if 'description' in result}
						<Notes note={String(result.description)}></Notes>
					{/if}
				</div>
				<Subtitle>Metadata</Subtitle>
				<Facts record={result} keys={['format', 'mimetype', 'created', 'size', 'last_modified']}
				></Facts>
			</div>
		</div>
		<div class="right-col">
			<Subtitle size="md">Downloads</Subtitle>
			<!-- {#if result.versions.length > 0} -->
			<div class="latest">
				<Subtitle>Latest:</Subtitle>
				<Button href={result.versions[0].url} download={result.name}>
					Download: {result.name ?? result.description} - {result.versions[0].version}
					<Icon icon={{ icon: 'file-download', set: 'tabler' }}></Icon>
				</Button>
			</div>
			<!-- {/if} -->

			<div class="versions-block">
				<Subtitle>Available versions</Subtitle>
				<div class="versions">
					{#each data.resource.versions as version}
						<Button href={version.url} download={result.name}>
							Version: {version.version}
							<Icon icon={{ icon: 'file-download', set: 'tabler' }}></Icon>
						</Button>
					{/each}
				</div>
			</div>
			{#if data.resource.metadata}
				<div class="structural-metadata">
					<Subtitle size="md">Structural metadata</Subtitle>
					<div class="tables">
						{#each data.resource.metadata.tables as table}
							<div class="table">
								<Subtitle>{table['dc:title']}</Subtitle>
								<BaseTable data={table.tableSchema.columns ?? []} {columns} {apiFn}></BaseTable>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</BaseSection>

{#if debug.status}
	<pre>{jstr(data)}</pre>
{/if}

<style>
	.resource-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		min-height: 70lvh;
		gap: 2rem;
	}
	.file-metadata {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.right-col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.versions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.structural-metadata {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.tables {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background-color: var(--background-muted);
		padding: 2rem;
	}
	.table {
		background-color: var(--background);
		padding: 1rem;
		border-radius: var(--radius);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	@media (min-width: 1024px) {
		.resource-section {
			grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
		}
	}
</style>
