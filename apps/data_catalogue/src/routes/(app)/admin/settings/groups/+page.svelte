<script lang="ts">
	import { type IColumnConfig } from '@svar-ui/svelte-grid'
	import { applyAction, enhance } from '$app/forms'
	import { debug } from '$lib/globals/dev.svelte.js'
	import { jstr } from '@arturoguzman/art-ui'
	import {
		ActionBar,
		Button,
		Checkbox,
		Icon,
		Input,
		Notice,
		Paragraph,
		SectionEdit,
		Select,
		Subtitle,
		Text,
		Textarea,
		Title
	} from '@imago/ui'
	import { onMount } from 'svelte'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import { notify } from '$lib/stores/notify.js'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { page } from '$app/state'
	import CellEditor from '$lib/ui/tables/cell_editor.svelte'
	import { DateTime } from 'luxon'
	import type { Group } from '$lib/server/entities/models/groups.js'
	import { handleEnhance } from '$lib/utils/forms'
	import type { PermissionRequest } from '$lib/server/entities/models/permissions'

	let { data } = $props()
	let delete_group = $state('')

	onMount(() => {
		debug.data = data
	})

	let columns: (IColumnConfig & { id: keyof Group })[] = [
		{
			id: 'title',
			header: 'Title',
			cell: CellEditor
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

	let selected = $derived(
		data.groups.findIndex((group) => group.id === page.url.searchParams.get('edit')) ?? -1
	)

	let edit = $state(false)
	let selected_user = $state('')
	let selected_user_delete = $state('')
	let search_results = $state([])
	let available_users = $derived(
		search_results.filter((au) => !data.group_users.find((gu) => gu.id === au.id))
	)
	const available_actions = (actor: PermissionRequest['actor']): PermissionRequest[] => [
		{
			namespace: 'Action',
			relation: 'groups',
			object: 'permissions',
			actor
		},
		{
			namespace: 'Action',
			relation: 'groups',
			object: 'users',
			actor
		},
		{
			namespace: 'Action',
			relation: 'groups',
			object: 'groups',
			actor
		},
		{
			namespace: 'Action',
			relation: 'groups',
			object: 'datasets',
			actor
		},
		{
			namespace: 'Action',
			relation: 'groups',
			object: 'answers',
			actor
		},
		{
			namespace: 'Action',
			relation: 'groups',
			object: 'questions',
			actor
		}
	]
</script>

<Title>Groups</Title>
<div class="tables">
	<SectionEdit open={selected !== -1 ? true : undefined}>
		{#snippet leftCol()}
			<ActionBar>
				{#snippet right()}
					<Button
						width="auto"
						onclick={() => {
							toggleDialog('add-group')
						}}
					>
						<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
					</Button>
				{/snippet}
			</ActionBar>
			<div class="groups">
				<BaseTable data={data.groups} {columns}></BaseTable>
			</div>
		{/snippet}
		{#snippet rightCol()}
			<div class="edit">
				{#if data.group}
					{@const group = data.group}
					<ActionBar>
						{#snippet left()}
							<Button width="auto" href={page.url.pathname}>
								<Icon icon={{ icon: 'arrow-narrow-left', set: 'tabler' }} />
							</Button>
						{/snippet}
						{#snippet right()}
							<Button
								width="auto"
								onclick={() => {
									delete_group = group.id
									toggleDialog('delete-group')
								}}
							>
								<Icon icon={{ icon: 'trash', set: 'tabler' }} />
							</Button>
						{/snippet}
					</ActionBar>
					<div class="section">
						<ActionBar>
							{#snippet left()}
								<Subtitle>{group.title}</Subtitle>
							{/snippet}
							{#snippet right()}
								<Button
									active={edit}
									onclick={() => {
										edit = !edit
									}}
								>
									<Icon icon={{ icon: 'edit', set: 'tabler' }} />
								</Button>
							{/snippet}
						</ActionBar>
						{#if !edit}
							<div class="card">
								<Paragraph>Title: {group.title}</Paragraph>
								<Paragraph
									>Created at: {DateTime.fromJSDate(group.created_at)
										.setLocale('en-gb')
										.toLocaleString(DateTime.DATETIME_MED)}</Paragraph
								>
								<Paragraph>Visibility: {group.visibility}</Paragraph>
								<Paragraph>Description: {group.description}</Paragraph>
							</div>
						{/if}

						{#if edit}
							<div class="card">
								<form
									action="?/edit"
									method="post"
									use:enhance={() => {
										return async ({ result, update }) => {
											if (result.type === 'error') {
												console.log(result)
												notify.send({ message: result.error.message })
											}
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
											update({ reset: true, invalidateAll: true })
										}
									}}
								>
									<input type="hidden" name="id" value={group.id} />
									<Input label="Title">
										<Text value={group.title} name="title"></Text>
									</Input>

									<Input label="Visibility">
										<Select
											name="visibility"
											value={group.visibility}
											options={[
												{ label: 'Public', value: 'public' },
												{ label: 'Private', value: 'private' }
											]}
										></Select>
									</Input>
									{#key group}
										<Input label="Description">
											<Textarea name="description" bind:value={group.description}></Textarea>
										</Input>
									{/key}

									<div class="buttons">
										<Button
											type="button"
											onclick={() => {
												edit = false
											}}>Cancel</Button
										>
										<Button>Save</Button>
									</div>
								</form>
							</div>
						{/if}
					</div>
					<div class="section">
						<ActionBar>
							{#snippet left()}
								<Subtitle>Members</Subtitle>
							{/snippet}
							{#snippet right()}
								<Paragraph>Current: {data.group_users.length}</Paragraph>
							{/snippet}
						</ActionBar>
						{#if data.group_users.length === 0}
							<Notice level="info">
								<Paragraph size="xs">This group doesn't have any members.</Paragraph>
							</Notice>
						{/if}
						<div class="buttons-multiple">
							{#each data.group_users as user}
								{#if !edit}
									<Paragraph style="label" size="xs">
										{user?.email}
									</Paragraph>
								{/if}
							{/each}
						</div>
						{#if edit}
							<div class="card">
								<Subtitle>Add users</Subtitle>
								<form
									action="?/search_users"
									method="post"
									use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												if (result.data?.users && Array.isArray(result.data.users)) {
													const filtered = result.data.users.filter(
														(au) => !data.group_users.find((gu) => gu.id === au.id)
													)
													// available_users = [...filtered]
													search_results = result.data.users
												}
											}
										}
									}}
								>
									<div class="search-bar">
										<Input>
											<Text name="identifier"></Text>
										</Input>
										<Button>Search</Button>
									</div>
								</form>

								{#if selected_user !== ''}
									{@const user = available_users.find((user) => user.id === selected_user)}
									<div class="relation-card">
										<form
											action="?/add_user"
											method="post"
											use:enhance={handleEnhance({
												onsuccess: () => {
													selected_user = ''
												}
											})}
										>
											<input type="hidden" name="user_id" value={user.id} />
											<input type="hidden" name="group_id" value={group.id} />
											<Paragraph>Add {user.email}?</Paragraph>
											<div class="buttons">
												<Button
													type="button"
													onclick={() => {
														selected_user = ''
													}}>Cancel</Button
												>
												<Button>Add</Button>
											</div>
										</form>
									</div>
								{/if}
								<div class="buttons-multiple">
									{#each available_users as user}
										<Button
											onclick={() => {
												selected_user = user.id
											}}>{user.email}</Button
										>
									{/each}
								</div>
							</div>

							{#if selected_user_delete !== ''}
								{@const user = data.group_users.find((user) => user.id === selected_user_delete)}
								{#if user}
									<div class="relation-card">
										<form
											action="?/remove_user"
											method="post"
											use:enhance={handleEnhance({
												onsuccess: () => {
													selected_user_delete = ''
												}
											})}
										>
											<input type="hidden" name="user_id" value={user.id} />
											<input type="hidden" name="group_id" value={group.id} />
											<Paragraph>{user.email}</Paragraph>
											<div class="buttons">
												<Button
													type="button"
													onclick={() => {
														selected_user_delete = ''
													}}>Cancel</Button
												>
												<Button>Remove</Button>
											</div>
										</form>
									</div>
								{/if}
							{/if}
							<div class="buttons-multiple">
								{#each data.group_users as user}
									{#if selected_user_delete !== user.id}
										<Button
											onclick={() => {
												selected_user_delete = user.id
											}}
										>
											<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
											{user.email}</Button
										>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
					{#if edit}
						<div class="section">
							<form action="?/toggle_autoenroll" method="post" use:enhance={handleEnhance()}>
								<input type="hidden" value={group.id} name="id" />
								<Input label="Autoenroll">
									<Checkbox name="autoenroll"></Checkbox>
								</Input>
								<Button>
									<Paragraph>Save</Paragraph>
								</Button>
							</form>
						</div>
					{/if}
					{#if edit}
						<div class="section">
							<Subtitle>Permissions</Subtitle>
							{#each available_actions( { namespace: 'Group', relation: 'members', object: group.id } ) as action (action)}
								<div class="card">
									{#if data.group_permissions?.relation_tuples?.find((rt) => rt.subject_set?.object === group.id && rt.object === action.object)}
										<form action="?/remove_action" method="post" use:enhance={handleEnhance()}>
											<input type="hidden" name="group_id" value={group.id} />
											<input type="hidden" name="object" value={action.object} />
											<Input label="Disable create {action.object}" layout="horizontal">
												<Button active style="alt">Enabled</Button>
											</Input>
										</form>
									{:else}
										<form action="?/add_action" method="post" use:enhance={handleEnhance()}>
											<input type="hidden" name="group_id" value={group.id} />
											<input type="hidden" name="object" value={action.object} />
											<Input label="Enable create {action.object}" layout="horizontal">
												<Button style="alt">Disabled</Button>
											</Input>
										</form>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			</div>
		{/snippet}
	</SectionEdit>
</div>

<Dialog id="delete-group">
	<Subtitle>Are you sure you want to delete this group?</Subtitle>
	<div class="buttons">
		<Button
			onclick={() => {
				delete_group = ''
				toggleDialog('delete-group')
			}}
		>
			Cancel
		</Button>
		<form
			action="?/delete"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'error') {
						console.log(result)
						notify.send({ message: result.error.message })
					}
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
					update({ reset: true, invalidateAll: true })
					delete_group = ''
					toggleDialog('delete-group')
				}
			}}
		>
			<input name="id" type="text" value={delete_group} hidden />
			<Button>Delete</Button>
		</form>
	</div>
</Dialog>
<Dialog id="add-group">
	<form
		action="?/create"
		method="post"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'error') {
					console.log(result)
					notify.send({ message: result.error.message })
				}
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
				update({ reset: true, invalidateAll: true })
			}
		}}
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

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.5rem;
	}
	.buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.buttons-multiple {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.search-bar {
		display: flex;
		gap: 1rem;
	}
	.edit {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.relation-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background-color: var(--background-muted);
		padding: 1rem;
		border: 1px solid var(--border);
	}
</style>
