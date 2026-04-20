<script lang="ts">
	import { type IApi, type IColumnConfig } from '@svar-ui/svelte-grid'
	import { debug } from '$lib/globals/dev.svelte'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import Notes from '$lib/ui/text/notes.svelte'
	import { jstr } from '@arturoguzman/art-ui'
	import { BaseSection, Button, Subtitle, Paragraph, Icon, formatBytes, Title } from '@imago/ui'
	import { DateTime } from 'luxon'
	import type { CSVWColumn } from '$lib/types/csvw.js'
	import CellText from '$lib/ui/tables/cell_text.svelte'

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
				<div class="metadata">
					<Subtitle>Metadata</Subtitle>
					{#if result.format !== null}
						<div class="metadata-field">
							<Subtitle>Format</Subtitle>
							<Notes note={String(result.format)}></Notes>
						</div>
					{/if}

					{#if result.mimetype !== null}
						<div class="metadata-field">
							<Subtitle>MIME Type</Subtitle>
							<Notes note={String(result.mimetype)}></Notes>
						</div>
					{/if}
					{#if result.created !== null}
						<div class="metadata-field">
							<Subtitle>Created</Subtitle>
							<Paragraph
								>{DateTime.fromISO(String(result.created)).toLocaleString(
									DateTime.DATETIME_FULL
								)}</Paragraph
							>
						</div>
					{/if}
					{#if result.last_modified !== null}
						<div class="metadata-field">
							<Subtitle>Modified</Subtitle>
							<Paragraph
								>{DateTime.fromISO(String(result.last_modified)).toLocaleString(
									DateTime.DATETIME_FULL
								)}</Paragraph
							>
						</div>
					{/if}
					{#if result.size}
						<div class="metadata-field">
							<Subtitle>Size</Subtitle>
							<Paragraph>{formatBytes(Number(result.size))}</Paragraph>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="right-col">
			<Subtitle size="md">Downloads</Subtitle>
			{#if Array.isArray(result) === false && typeof result.url === 'string'}
				<div class="latest">
					<Subtitle>Latest:</Subtitle>
					<Button href={result.url} download={result.name}
						>Download: {result.name ?? result.description}
						<Icon icon={{ icon: 'file-download', set: 'tabler' }}></Icon>
					</Button>
				</div>
			{/if}

			<div class="versions-block">
				<Subtitle>Available versions</Subtitle>
				<div class="versions">
					{#each data.resource.versions as version}
						<Button href="{result.url}?version={version.version}" download={result.name}>
							Version: {version.version}
							<Icon icon={{ icon: 'file-download', set: 'tabler' }}></Icon>
						</Button>
					{/each}
				</div>
			</div>
			{#if data.resource.structural_metadata}
				<div class="structural-metadata">
					<Subtitle size="md">Structural metadata</Subtitle>
					<div class="tables">
						{#each data.resource.structural_metadata.tables as table}
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
	}
	.file-metadata {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.metadata {
		width: 100%;
		display: grid;
		grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
		grid-auto-flow: row;
		gap: 0rem 2rem;
	}
	.metadata-field {
		display: grid;
		grid-column: 1/-1;
		grid-template-rows: subgrid;
		grid-template-columns: subgrid;
		width: 100%;
		overflow-x: hidden;
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
