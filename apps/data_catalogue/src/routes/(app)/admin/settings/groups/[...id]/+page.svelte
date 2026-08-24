<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { jstr } from '@arturoguzman/art-ui'
	import {
		ActionBar,
		BaseSection,
		Button,
		Checkbox,
		Icon,
		Input,
		Notice,
		Paragraph,
		Select,
		Subtitle,
		Text,
		Textarea,
		Title
	} from '@imago/ui'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import { notify } from '$lib/stores/notify.js'
	import { handleEnhance } from '$lib/utils/forms'
	import type { PermissionRequest } from '$lib/server/entities/models/permissions'
	import CardBlock from '$lib/ui/cards/card_block.svelte'
	import Facts from '$lib/ui/cards/facts.svelte'
	import { toggleSettingsPermission } from '$lib/remotes/permissions/update.remote'
	import { invalidateAll } from '$app/navigation'
	import {
		groupAddUser,
		groupRemoveUser,
		toggleAutoEnroll
	} from '$lib/remotes/groups/update.remote.js'
	import { usersSearch } from '$lib/remotes/users/get.remote'
	import { page } from '$app/state'
	import CardUser from '$lib/ui/cards/card_user.svelte'

	let { data } = $props()
	let delete_group = $state('')
	let edit = $state(true)
	let search_results: { first_name: string; last_name: string; email: string; id: string }[] =
		$state([])
	let available_users = $derived(
		search_results.filter((au) => !data.group_users.find((gu) => gu.id === au.id))
	)
	const available_settings = [
		{
			namespace: 'Application',
			relation: 'admins',
			object: 'dashboard'
		},
		{
			namespace: 'Application',
			relation: 'admins',
			object: 'datasets'
		},
		{
			namespace: 'Application',
			relation: 'admins',
			object: 'groups'
		},
		{
			namespace: 'Application',
			relation: 'admins',
			object: 'permissions'
		},
		{
			namespace: 'Application',
			relation: 'admins',
			object: 'registration'
		},
		{
			namespace: 'Application',
			relation: 'admins',
			object: 'users'
		}
	]
</script>

<div class="page">
	{#if data.group}
		{@const group = data.group}
		<ActionBar>
			{#snippet left()}
				<Button width="auto" href="/admin/settings/groups">
					<Icon icon={{ icon: 'arrow-narrow-left', set: 'tabler' }} />
				</Button>
			{/snippet}
			{#snippet right()}
				{#if data.allow_manage}
					<Button
						width="auto"
						onclick={() => {
							delete_group = group.id
							toggleDialog('delete-group')
						}}
					>
						<Icon icon={{ icon: 'trash', set: 'tabler' }} />
					</Button>
				{/if}
			{/snippet}
		</ActionBar>
		<BaseSection style="title" title="Group metadata">
			{#if !edit}
				<Facts
					record={group}
					keys={['title', 'created_at', 'updated_at', 'visibility', 'description']}
				></Facts>
			{/if}

			<div class="card">
				<form
					action="?/edit"
					method="post"
					use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'error') {
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
		</BaseSection>

		<BaseSection style="title">
			{#snippet header()}
				<ActionBar>
					{#snippet left()}
						<Title>Members</Title>
					{/snippet}
					{#snippet right()}
						<Button
							style="circle"
							onclick={() => {
								toggleDialog('add-all-users')
							}}
						>
							<Icon icon={{ icon: 'table-plus', set: 'tabler' }}></Icon>
						</Button>
						<Button
							onclick={() => {
								toggleDialog('add-users')
							}}
						>
							<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
						</Button>
						<!-- <Paragraph>Current: {data.group_users.length}</Paragraph> -->
					{/snippet}
				</ActionBar>
			{/snippet}
			<div class="buttons-multiple">
				{#each data.group_users as user}
					{#if !edit}
						<Paragraph style="label" size="xs">
							{user?.email}
						</Paragraph>
					{/if}
				{/each}
			</div>
			<div class="card">
				{#if data.group_users.length === 0}
					<Notice level="info">
						<Paragraph size="xs">This group doesn't have any members.</Paragraph>
					</Notice>
				{/if}
				<div class="buttons-multiple">
					{#each data.group_users as user}
						{@const form = groupRemoveUser.for(user.id)}
						<CardUser {user}>
							<Button
								onclick={() => {
									toggleDialog(`remove-${user.id}`)
								}}
							>
								<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
							</Button>
							<Dialog id="remove-{user.id}">
								<form
									{...form.enhance(async ({ submit }) => {
										const valid = await submit()
										if (valid) {
											notify.send({ message: 'Success' })
											toggleDialog(`remove-${user.id}`)
										}
									})}
								>
									<input {...form.fields.user_id.as('hidden', user.id)} />
									<input {...form.fields.group_id.as('hidden', String(page.params.id))} />
									<Subtitle size="sm"
										>Are you sure you want to remove {user.first_name}
										{user.last_name} from {data.group?.title}?</Subtitle
									>
									<div class="buttons">
										<Button
											type="button"
											onclick={() => {
												toggleDialog(`remove-${user.id}`)
											}}
										>
											Cancel
										</Button>
										<Button>Remove</Button>
									</div>
								</form>
							</Dialog>
						</CardUser>
					{/each}
				</div>
			</div>
		</BaseSection>
		<BaseSection style="title" title="Configuration">
			{@const enabled = group.autoenroll ?? false}
			<div class="sections">
				<div class="section-grid">
					<form
						class="form-grid"
						{...toggleAutoEnroll.enhance(async ({ submit }) => {
							const valid = await submit()
							if (valid) {
								notify.send({ message: 'Saved configuration' })
							}
						})}
					>
						<input {...toggleAutoEnroll.fields.id.as('hidden', group.id)} />
						<Input subgrid label="Autoenroll" layout="horizontal">
							{#snippet message()}
								<Paragraph style="full-width" size="sm">
									Enable to automatically enroll new users to this group once they have completed
									registration
								</Paragraph>
							{/snippet}
							<Checkbox
								{...toggleAutoEnroll.fields.autoenroll.as('checkbox', enabled)}
								onchange={async () => {
									const valid = await toggleAutoEnroll.submit()
									if (valid) {
										notify.send({ message: 'Saved configuration' })
										await invalidateAll()
										return
									}
								}}
							></Checkbox>
						</Input>
					</form>
				</div>
				<div class="subtitle-block">
					<Subtitle>Dashboard</Subtitle>
					<Paragraph style="full-width" size="sm">
						Enable to grant people in the group access to dashboard features. With viewer access is
						read-only. With admin access they can manage the resources.
					</Paragraph>
				</div>
				<div class="section-grid">
					{#each available_settings as action (action)}
						{@const form = toggleSettingsPermission.for(action.object)}
						{@const enabled = data.group_permissions_settings?.relation_tuples?.find(
							(rt) => rt.subject_set?.object === group.id && rt.object === action.object
						)}

						{#each form.fields.allIssues() as issue}
							<Notice level="warning">
								<Paragraph current_colour>
									{issue.message}
								</Paragraph>
							</Notice>
						{/each}
						<form
							class="form-grid"
							{...form.enhance(async ({ submit }) => {
								await submit()
							})}
						>
							<input {...form.fields.namespace.as('hidden', action.namespace)} />
							<input {...form.fields.object.as('hidden', action.object)} />
							<input {...form.fields.actor.namespace.as('hidden', 'Group')} />
							<input {...form.fields.actor.object.as('hidden', group.id)} />
							<input {...form.fields.actor.relation.as('hidden', 'members')} />
							{#each form.fields.relation.issues() as issue}
								<p class="issue">{issue.message}</p>
							{/each}
							<Input
								subgrid
								label={enabled
									? `Access ${action.object} enabled`
									: `Access ${action.object} disabled`}
								layout="horizontal"
							>
								<Select
									{...form.fields.relation.as('select', enabled ? enabled.relation : null)}
									same_width
									options={[
										{ label: 'None', value: null },
										{ label: 'Viewer', value: 'viewers' },
										{ label: 'Admin', value: 'admins' }
									]}
									onchange={async () => {
										const valid = await form.submit()
										if (valid) {
											notify.send({ message: `Saved configuration` })
										}
									}}
								></Select>
							</Input>
						</form>
					{/each}
				</div>
			</div>
		</BaseSection>
	{/if}
</div>
<Dialog id="add-users">
	<div class="dialog">
		<ActionBar>
			{#snippet left()}
				<Title>Add users</Title>
			{/snippet}
			{#snippet right()}
				<Button
					style="circle"
					onclick={() => {
						toggleDialog('add-users')
					}}
				>
					<Icon icon={{ icon: 'x', set: 'tabler' }}></Icon>
				</Button>
			{/snippet}
		</ActionBar>
		<form
			{...usersSearch.enhance(async ({ submit }) => {
				const valid = await submit()
				if (valid && usersSearch.result) {
					search_results = usersSearch.result
				}
			})}
		>
			<div class="search-bar">
				<Input>
					<Text {...usersSearch.fields.term.as('text')}></Text>
				</Input>
				<Button>Search</Button>
			</div>
		</form>
		{#if available_users.length > 0}
			<div class="results">
				{#each available_users as user}
					<form {...groupAddUser}>
						<input type="hidden" name="user_id" value={user.id} />
						<input type="hidden" name="group_id" value={page.params.id} />
						<Button>
							<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
							{user.email}</Button
						>
					</form>
				{/each}
			</div>
		{/if}
	</div>
</Dialog>
<Dialog id="add-all-users">
	<div class="dialog">
		<div class="form">
			<form
				action="?/add_all_users"
				method="post"
				use:enhance={handleEnhance({
					onsuccess: () => {
						toggleDialog('add-all-users')
					}
				})}
			>
				<input type="hidden" name="group_id" value={data.group?.id} />
				<Subtitle>Are you sure you want to add all existing users to this group?</Subtitle>
				<div class="buttons">
					<Button
						type="button"
						onclick={() => {
							toggleDialog('add-all-users')
						}}>Cancel</Button
					>
					<Button>Confirm</Button>
				</div>
			</form>
		</div>
	</div>
</Dialog>
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
			use:enhance={handleEnhance({
				onsuccess: () => {
					delete_group = ''
					toggleDialog('delete-group')
				}
			})}
		>
			<input name="id" type="text" value={delete_group} hidden />
			<Button>Delete</Button>
		</form>
	</div>
</Dialog>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		/* padding: 0.5rem; */
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
	.page {
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
	.sections {
		display: grid;
		grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
		gap: 1rem;
	}
	.section-grid {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: subgrid;
		gap: 1rem;
	}
	.form-grid {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: subgrid;
	}
	.results {
		padding: 1rem;
		background-color: var(--background-muted);
		border-radius: var(--radius);
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-auto-flow: row;
		gap: 0.5rem;
	}
	.dialog {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.subtitle-block {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		grid-column: 1/-1;
	}
</style>
