<script lang="ts">
	import { type IColumnConfig } from '@svar-ui/svelte-grid'
	import { debug } from '$lib/globals/dev.svelte.js'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import {
		SectionEdit,
		Title,
		Subtitle,
		Button,
		Paragraph,
		Icon,
		ActionBar,
		handleSearchParams
	} from '@imago/ui'
	import { onMount } from 'svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { jstr } from '@arturoguzman/art-ui'
	import CellEditor from '$lib/ui/tables/cell_editor.svelte'
	import { page } from '$app/state'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import { applyAction, enhance } from '$app/forms'
	import { notify } from '$lib/stores/notify.js'
	import Facts from '$lib/ui/cards/facts.svelte'
	let { data } = $props()
	const columns: (IColumnConfig & {
		id: 'first_name' | 'last_name' | 'id' | 'email' | 'groups'
	})[] = [
		{
			id: 'first_name',
			header: 'First name',
			cell: CellText
		},
		{
			id: 'last_name',
			header: 'Last name',
			cell: CellText
		},
		{
			id: 'email',
			header: 'Email',
			cell: CellText,
			width: 300
		},

		{
			id: 'id',
			header: 'ID',
			cell: CellEditor,
			width: 400
		}
	]
	onMount(() => {
		debug.data = data
	})
	let selected = $derived(
		data.users.items.findIndex((group) => group.id === page.url.searchParams.get('edit')) ?? -1
	)
</script>

<SectionEdit open={selected > -1 ? true : undefined}>
	{#snippet leftCol()}
		<div class="section">
			<Title>Users</Title>
			<BaseTable data={data.users.items} {columns}></BaseTable>
			<div class="buttons">
				{#if data.users.items}
					<Button
						href={handleSearchParams({
							add: [
								{ key: 'page', value: 1, set: true },
								{ key: 'limit', value: 20, set: true }
							],
							remove: ['edit'],
							url: page.url
						})}>First</Button
					>
				{/if}

				{#if data.users.total > 0}
					<div class="buttons">
						<div class="buttons">
							<Paragraph>Total: {data.users.total}</Paragraph>
							{#if Number(page.url.searchParams.get('page')) > 1}
								<Button
									href={handleSearchParams({
										add: [
											{
												key: 'page',
												value: Number(page.url.searchParams.get('page')) - 1,
												set: true
											},
											{ key: 'limit', value: data.users.limit, set: true }
										],
										remove: ['edit'],
										url: page.url
									})}>Previous</Button
								>{/if}
						</div>
						<Button
							href={handleSearchParams({
								add: [
									{ key: 'page', value: Number(page.url.searchParams.get('page')) + 1, set: true },
									{ key: 'limit', value: data.users.limit, set: true }
								],
								remove: ['edit'],
								url: page.url
							})}>Next</Button
						>
					</div>
				{/if}
			</div>
		</div>
	{/snippet}
	{#snippet rightCol()}
		{#if !data.user}
			<div class="edit">
				<ActionBar>
					{#snippet left()}
						<Button href={handleSearchParams({ remove: ['edit'], url: page.url })}>
							<Icon icon={{ icon: 'arrow-narrow-left', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
				</ActionBar>
				<Paragraph>User hasn't completed registration</Paragraph>
			</div>
		{/if}
		{#if data.user !== null}
			<div class="edit">
				<ActionBar>
					{#snippet left()}
						<Button href={handleSearchParams({ remove: ['edit'], url: page.url })}>
							<Icon icon={{ icon: 'arrow-narrow-left', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
					{#snippet right()}
						<Button
							onclick={() => {
								toggleDialog(`delete-${data.user?.id}`)
							}}
						>
							<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
				</ActionBar>
				<div class="section">
					<Subtitle>User details</Subtitle>
					<Facts
						record={data.user}
						keys={['first_name', 'last_name', 'email', 'created_at', 'updated_at', 'status']}
					></Facts>
				</div>
			</div>
		{/if}
	{/snippet}
</SectionEdit>

{#if data.user}
	<Dialog id="delete-{data.user.id}">
		<form
			action="?/delete"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if ('data' in result && result.data) {
						if ('errors' in result.data) {
							notify.send(String(jstr(result.data.errors)))
						}
						if ('message' in result.data) {
							notify.send(String(result.data.message))
						}
					}
					if (result.type === 'redirect') {
						applyAction(result)
					}

					await update({ reset: true, invalidateAll: true })
				}
			}}
		>
			<input type="hidden" value={data.user} name="id" />
			<Paragraph
				>Are you sure you want to delete {data.user}
				{data.user}?</Paragraph
			>
			<div class="buttons">
				<Button
					type="button"
					onclick={() => {
						toggleDialog(`delete-${data.user}`)
					}}>Cancel</Button
				>
				<Button>Delete</Button>
			</div>
		</form>
	</Dialog>
{/if}

<style>
	.edit {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
	}
</style>
