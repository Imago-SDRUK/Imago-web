<script lang="ts">
	import { type IColumnConfig } from '@svar-ui/svelte-grid'
	import type { Group } from '$lib/server/entities/models/groups.js'
	import { enhance } from '$app/forms'
	import { debug } from '$lib/globals/dev.svelte.js'
	import { ActionBar, Button, Icon, Input, Subtitle, Text, Textarea, Title } from '@imago/ui'
	import { onMount } from 'svelte'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { page } from '$app/state'
	import { handleEnhance } from '$lib/utils/forms'

	import { goto } from '$app/navigation'
	import CellEditorCtx from '$lib/ui/tables/cell_editor_ctx.svelte'
	import { resolve } from '$app/paths'

	let { data } = $props()

	onMount(() => {
		debug.data = data
	})

	let columns: (IColumnConfig & { id: keyof Group })[] = [
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
			id: 'created_at',
			header: 'Created at',
			cell: CellText,
			width: 400
		},
		{
			id: 'updated_at',
			header: 'Updated at',
			cell: CellText,
			width: 400
		}
	]
</script>

<Title>Groups</Title>
<div class="tables">
	<ActionBar>
		{#snippet right()}
			{#if data.allow_manage}
				<Button
					width="auto"
					onclick={() => {
						toggleDialog('add-group')
					}}
				>
					<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
				</Button>
			{/if}
		{/snippet}
	</ActionBar>
	<div class="groups">
		<BaseTable
			data={data.groups}
			{columns}
			onopeneditor={({ row }) => {
				if (row?.id) {
					goto(resolve(`/admin/settings/groups/${row.id}`))
				} else {
					goto(page.url.pathname)
				}
			}}
		></BaseTable>
	</div>
</div>

<Dialog id="add-group">
	<form action="?/create" method="post" use:enhance={handleEnhance()}>
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
					toggleDialog('add-group')
				}}>Cancel</Button
			>
			<Button
				onclick={() => {
					toggleDialog('add-group')
				}}>Save</Button
			>
		</div>
	</form>
</Dialog>

<style>
	.tables {
		display: grid;
		gap: 2rem;
		padding: 0 1rem;
	}

	.groups {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
