<script lang="ts">
	import { type IColumnConfig } from '@svar-ui/svelte-grid'
	import { debug } from '$lib/globals/dev.svelte.js'
	import type { CkanDataset, CkanGroup } from '$lib/types/ckan/index.js'
	import DatasetCard from '$lib/ui/cards/dataset_card.svelte'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import {
		Title,
		Button,
		SectionEdit,
		ActionBar,
		Icon,
		Paragraph,
		Subtitle,
		handleSearchParams,
		Input,
		Text,
		Textarea
	} from '@imago/ui'
	import { onMount } from 'svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import CellTags from '$lib/ui/tables/cell_tags.svelte'
	import { page } from '$app/state'
	import CellGroups from '$lib/ui/tables/cell_groups.svelte'
	import CellBoolean from '$lib/ui/tables/cell_boolean.svelte'
	import CellStatus from '$lib/ui/tables/cell_status.svelte'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import { enhance } from '$app/forms'
	import CellDate from '$lib/ui/tables/cell_date.svelte'
	import { goto } from '$app/navigation'
	import CellEditorCtx from '$lib/ui/tables/cell_editor_ctx.svelte'
	import { handleEnhance } from '$lib/utils/forms/index.js'
	let { data } = $props()
	let dataset_selected = $derived(
		data.datasets.items?.findIndex(
			(dataset) => dataset.id === page.url.searchParams.get('edit_dataset')
		) ?? -1
	)

	let metadata_group_selected = $derived(
		data.metadata_groups?.findIndex(
			(mg) => mg.id === page.url.searchParams.get('edit_metadata_group')
		) ?? -1
	)

	const columns: (IColumnConfig & { id: keyof CkanDataset })[] = [
		{
			id: 'title',
			header: 'Title',
			sort: true,
			cell: CellEditorCtx,
			resize: true,
			width: 600
		},

		{
			id: 'state',
			header: 'Status',
			sort: true,
			cell: CellStatus,
			resize: true
		},
		{
			id: 'version',
			header: 'Version',
			sort: true,
			cell: CellText,
			resize: true
		},
		{
			id: 'type',
			header: 'Type',
			sort: true,
			cell: CellText,
			resize: true
		},
		{
			id: 'author',
			header: 'Author',
			sort: true,
			cell: CellText,
			resize: true
		},
		{
			id: 'groups',
			header: 'Groups',
			sort: true,
			cell: CellGroups,
			resize: true
		},
		{
			id: 'tags',
			header: 'tags',
			sort: true,
			cell: CellTags,
			resize: true
		},
		{
			id: 'isopen',
			header: 'Is open',
			sort: true,
			cell: CellBoolean,
			resize: true
		},
		{
			id: 'private',
			header: 'Private',
			sort: true,
			cell: CellBoolean,
			resize: true
		}
	]

	const metadata_groups_columns: (IColumnConfig & { id: keyof CkanGroup })[] = [
		{
			id: 'title',
			header: 'Title',
			cell: CellEditorCtx
		},
		{
			id: 'description',
			header: 'Description',
			cell: CellText
		},
		{
			id: 'created',
			header: 'Created at',
			cell: CellDate,
			width: 400
		}
	]
	onMount(() => {
		debug.data = data
	})
</script>

<SectionEdit open={dataset_selected !== -1 || metadata_group_selected !== -1 ? true : undefined}>
	{#snippet leftCol()}
		<div class="sections">
			<div class="section">
				<Title>Datasets</Title>
				<div class="left-col">
					<BaseTable
						query="dataset_selected"
						data={data.datasets.items}
						{columns}
						onopeneditor={({ row }) => {
							if (row?.id) {
								goto(
									handleSearchParams({
										toggle: [{ key: 'edit_dataset', value: row.id }],
										remove: ['edit_metadata_group'],
										url: page.url
									})
								)
							} else {
								goto(page.url.pathname)
							}
						}}
					></BaseTable>
				</div>
			</div>
			<div class="section">
				<ActionBar>
					{#snippet left()}
						<Title>Metadata groups</Title>
					{/snippet}
					{#snippet right()}
						<Button
							onclick={() => {
								toggleDialog('create-metadata-group')
							}}
						>
							<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
				</ActionBar>
				<div class="left-col">
					<BaseTable
						query="edit_metadata_group"
						data={data.metadata_groups.filter((x) => typeof x !== 'string')}
						columns={metadata_groups_columns}
						onopeneditor={({ row }) => {
							if (row?.id) {
								goto(
									handleSearchParams({
										toggle: [{ key: 'edit_metadata_group', value: row.id }],
										remove: ['edit_dataset'],
										url: page.url
									})
								)
							} else {
								goto(page.url.pathname)
							}
						}}
					></BaseTable>
				</div>
			</div>
		</div>
	{/snippet}
	{#snippet rightCol()}
		{#if data.dataset}
			<ActionBar>
				{#snippet left()}
					<Button width="auto" href={page.url.pathname}>
						<Icon icon={{ icon: 'arrow-narrow-left', set: 'tabler' }}></Icon>
					</Button>
				{/snippet}
				{#snippet right()}
					<Button
						width="auto"
						onclick={() => {
							toggleDialog(`dataset-delete`)
						}}
					>
						<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
					</Button>
				{/snippet}
			</ActionBar>
			<div class="edit">
				<DatasetCard
					resources={data.resources}
					relationships={data.relationships}
					dataset={data.dataset}
					groups={data.metadata_groups}
					actors={data.actors}
				></DatasetCard>
			</div>
		{/if}

		{#if data.metadata_group}
			<div class="edit">
				<ActionBar>
					{#snippet left()}
						<Button width="auto" href={page.url.pathname}>
							<Icon icon={{ icon: 'arrow-narrow-left', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
					{#snippet right()}
						<Button
							width="auto"
							onclick={() => {
								toggleDialog(`group-delete`)
							}}
						>
							<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
				</ActionBar>
			</div>
		{/if}
	{/snippet}
</SectionEdit>

<Dialog id="dataset-delete">
	<Subtitle size="md">Delete dataset</Subtitle>
	<Paragraph>Are you sure you want to delete this dataset?</Paragraph>
	<form
		action="/datasets?/delete"
		method="post"
		use:enhance={handleEnhance({
			onsuccess: () => {
				toggleDialog('dataset-delete')
			}
		})}
	>
		<div class="fields">
			<input type="text" hidden value={data.dataset?.id} name="id" />
		</div>
		<div class="buttons">
			<Button
				type="button"
				onclick={() => {
					toggleDialog('dataset-delete')
				}}>Cancel</Button
			>
			<Button>Delete</Button>
		</div>
	</form>
</Dialog>

<Dialog id="group-delete">
	<Subtitle size="md">Delete dataset</Subtitle>
	<Paragraph>Are you sure you want to delete this group?</Paragraph>
	<form
		action="?/delete_group"
		method="post"
		use:enhance={handleEnhance({
			onsuccess: () => {
				toggleDialog('group-delete')
			}
		})}
	>
		<div class="fields">
			<input type="text" hidden value={data.metadata_group?.id} name="group_id" />
		</div>
		<div class="buttons">
			<Button
				type="button"
				onclick={() => {
					toggleDialog('group-delete')
				}}>Cancel</Button
			>
			<Button>Delete</Button>
		</div>
	</form>
</Dialog>

<Dialog id="create-metadata-group">
	<form
		action="?/create_metadata_group"
		method="post"
		use:enhance={handleEnhance({
			onsuccess: () => {
				toggleDialog('create-metadata-group')
			}
		})}
	>
		<Subtitle>Add group</Subtitle>
		<div class="inputs">
			<Input label="Title">
				<Text name="title"></Text>
			</Input>
			<Input label="Description">
				<Textarea name="description"></Textarea>
			</Input>
		</div>
		<div class="buttons">
			<Button
				type="button"
				onclick={() => {
					toggleDialog('create-metadata-group')
				}}>Cancel</Button
			>
			<Button>Save</Button>
		</div>
	</form>
</Dialog>

<style>
	.sections {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.left-col {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}
</style>
