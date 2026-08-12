<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'
	import { storageCreate } from '$lib/remotes/storages/create.remote'
	import { storageDelete } from '$lib/remotes/storages/delete.remote'
	import type { Storage } from '$lib/server/entities/models/storage.js'
	import { notify } from '$lib/stores/notify.js'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import Facts from '$lib/ui/cards/facts.svelte'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import CellEditor from '$lib/ui/tables/cell_editor.svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import { jstr } from '@arturoguzman/art-ui'
	import {
		Notice,
		SectionEdit,
		Subtitle,
		Title,
		Paragraph,
		ActionBar,
		Button,
		Icon,
		Input,
		Text,
		Select
	} from '@imago/ui'
	import type { IColumnConfig } from '@svar-ui/svelte-grid'

	let { data } = $props()

	let selected = $derived(
		data.storages.items.findIndex((storage) => storage.id === page.url.searchParams.get('edit')) ??
			-1
	)
	const columns: (IColumnConfig & {
		id: keyof Storage
		// id: 'first_name' | 'last_name' | 'id' | 'email' | 'groups'
	})[] = [
		{
			id: 'name',
			header: 'Name',
			cell: CellEditor
		},
		{
			id: 'type',
			header: 'Type',
			cell: CellText
		},
		{
			id: 'created_at',
			header: 'Created at',
			cell: CellText,
			width: 350
		},
		{
			id: 'updated_at',
			header: 'Updated at',
			cell: CellText,
			width: 350
		}
	]
	const current_type = $derived(storageCreate.fields.type.value())
</script>

<SectionEdit open={selected > -1 ? true : undefined}>
	{#snippet leftCol()}
		<div class="section">
			<ActionBar>
				{#snippet left()}
					<Title>Storage</Title>
				{/snippet}
				{#snippet right()}
					<Button
						onclick={() => {
							toggleDialog(`add-storage`)
						}}
					>
						<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
					</Button>
				{/snippet}
			</ActionBar>
			<BaseTable {columns} data={data.storages.items}></BaseTable>
			{#if data.storages.items.length === 0}
				<Notice level="info">
					<Paragraph>There are no storages configured</Paragraph>
				</Notice>
			{/if}
		</div>
	{/snippet}
	{#snippet rightCol()}
		{#if data.storage}
			{@const storage = data.storage}
			<ActionBar>
				{#snippet left()}
					<Subtitle>{storage.name}</Subtitle>
				{/snippet}
				{#snippet right()}
					<Button
						onclick={() => {
							toggleDialog(`delete-${storage.id}`)
						}}
					>
						<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
					</Button>
					<Dialog id="delete-{storage.id}">
						<form
							{...storageDelete.enhance(async ({ submit }) => {
								const valid = await submit()
								if (valid) {
									toggleDialog(`delete-${storage.id}`)
									goto(resolve(`/admin/settings/storage`))
									if (storageDelete.result) {
										notify.send({ message: storageDelete.result.message })
									}
								}
							})}
						>
							<div class="inputs">
								<Subtitle>Are you sure you want to delete {storage.name}?</Subtitle>
								<input {...storageDelete.fields.id.as('hidden', storage.id)} />
							</div>
							<div class="buttons">
								<Button
									type="button"
									onclick={() => {
										toggleDialog(`delete-${storage.id}`)
									}}>Cancel</Button
								>
								<Button>Delete</Button>
							</div>
						</form>
					</Dialog>
				{/snippet}
			</ActionBar>
			<div class="section">
				<Facts record={storage} keys={['id', 'name', 'type']}></Facts>
				<Facts record={storage.credentials}></Facts>
			</div>
		{/if}
	{/snippet}
</SectionEdit>
<Dialog id="add-storage">
	<form
		{...storageCreate.enhance(async ({ submit }) => {
			const valid = await submit()
			if (valid) {
				toggleDialog(`add-storage`)
				if (storageCreate.result) {
					notify.send({ message: storageCreate.result.message })
				}
			}
		})}
	>
		{#each storageCreate.fields.allIssues() as issue}
			<Notice level="warning">
				<Paragraph>{issue.message}</Paragraph>
			</Notice>
		{/each}
		<div class="inputs">
			<Input label="Name" required>
				{#each storageCreate.fields.name.issues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<Text {...storageCreate.fields.name.as('text')}></Text>
			</Input>
			<Input label="Type" required>
				{#each storageCreate.fields.type.issues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<Select
					{...storageCreate.fields.type.as('select')}
					options={[
						{ label: 'Azure', value: 'azure' },
						{ label: 'Local', value: 'local' }
					]}
					onchange={(e) => {
						if (typeof e === 'string') {
							storageCreate.fields.type.set(e)
						}
					}}
				></Select>
			</Input>
			{#if current_type === 'azure'}
				<Input label="Account name" required>
					{#each storageCreate.fields.credentials.account_name.issues() as issue}
						<Notice level="negative">
							<Paragraph>{issue.message}</Paragraph>
						</Notice>
					{/each}
					<Text {...storageCreate.fields.credentials.account_name.as('text')} required></Text>
				</Input>
				<Input label="Account key" required>
					{#each storageCreate.fields.credentials.account_key.issues() as issue}
						<Notice level="negative">
							<Paragraph>{issue.message}</Paragraph>
						</Notice>
					{/each}
					<Text {...storageCreate.fields.credentials.account_key.as('text')} required></Text>
				</Input>
				<Input label="Container" required>
					{#each storageCreate.fields.credentials.container.issues() as issue}
						<Notice level="negative">
							<Paragraph>{issue.message}</Paragraph>
						</Notice>
					{/each}
					<Text {...storageCreate.fields.credentials.container.as('text')} required></Text>
				</Input>
				<Input label="Path">
					{#each storageCreate.fields.credentials.path.issues() as issue}
						<Notice level="negative">
							<Paragraph>{issue.message}</Paragraph>
						</Notice>
					{/each}
					<Text {...storageCreate.fields.credentials.path.as('text')}></Text>
				</Input>
			{/if}
			{#if current_type === 'local'}
				<Input label="Path" required>
					{#each storageCreate.fields.credentials.path.issues() as issue}
						<Notice level="negative">
							<Paragraph>{issue.message}</Paragraph>
						</Notice>
					{/each}
					<Text {...storageCreate.fields.credentials.path.as('text')} required></Text>
				</Input>
			{/if}
		</div>
		<div class="buttons">
			<Button
				type="button"
				onclick={() => {
					toggleDialog(`add-storage`)
				}}>Cancel</Button
			>
			<Button>Create</Button>
		</div>
	</form>
</Dialog>

<style>
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
