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
		handleSearchParams,
		Select,
		Input
	} from '@imago/ui'
	import { onMount } from 'svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { capitalise, jstr } from '@arturoguzman/art-ui'
	import CellGroups from '$lib/ui/tables/cell_groups.svelte'
	import CellEditor from '$lib/ui/tables/cell_editor.svelte'
	import { page } from '$app/state'
	import { DateTime } from 'luxon'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import { applyAction, enhance } from '$app/forms'
	import { notify } from '$lib/stores/notify.js'
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
			id: 'groups',
			header: 'Groups',
			cell: CellGroups,
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
	let show_groups = $state(false)
</script>

<form
	action="?/create"
	method="post"
	use:enhance={() => {
		return async ({ result }) => {
			console.log(result)
		}
	}}
>
	<Input label="Status">
		<Select name="status">
			{#each ['preregister', 'active', 'archived', 'draft', 'suspended'] as v}
				<option value={v}>{v}</option>
			{/each}
		</Select>
	</Input>
	<Button>Create user</Button>
</form>
<SectionEdit open={selected > -1 ? true : undefined}>
	{#snippet leftCol()}
		<div class="section">
			<Title>Users</Title>
			<BaseTable data={data.users.items} {columns}></BaseTable>
			<div class="buttons">
				<pre>{jstr(data.users)}</pre>
				{#if data.users.first}
					<Button
						href={handleSearchParams({
							add: [
								{ key: 'page_size', value: data.users.first.page_size, set: true },
								{ key: 'page_token', value: data.users.first.page_token, set: true }
							],
							remove: ['edit'],
							url: page.url
						})}>First</Button
					>
				{/if}

				{#if data.users.next}
					<Button
						href={handleSearchParams({
							add: [
								{ key: 'page_size', value: data.users.next.page_size, set: true },
								{ key: 'page_token', value: data.users.next.page_token, set: true }
							],
							remove: ['edit'],
							url: page.url
						})}>Next</Button
					>
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
					<div class="details">
						<Paragraph>First name: {data.user.first_name}</Paragraph>
						<Paragraph>Last name: {data.user.last_name}</Paragraph>
						<Paragraph>Email: {data.user.email}</Paragraph>
						{#if data.user?.created_at}
							<Paragraph
								>Created at: {DateTime.fromISO(data.user?.created_at)
									.setLocale('en-gb')
									.toLocaleString(DateTime.DATETIME_MED)}</Paragraph
							>
						{/if}
						{#if data.user?.updated_at}
							<Paragraph
								>Updated at: {DateTime.fromISO(data.user?.updated_at)
									.setLocale('en-gb')
									.toLocaleString(DateTime.DATETIME_MED)}</Paragraph
							>
						{/if}
					</div>
				</div>

				<div class="section">
					<ActionBar>
						{#snippet left()}
							<Subtitle>Groups</Subtitle>
						{/snippet}
						{#snippet right()}
							<Button
								active={show_groups}
								onclick={() => {
									show_groups = !show_groups
								}}
							>
								<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
							</Button>
						{/snippet}
					</ActionBar>
					{#if !show_groups}
						<div class="groups">
							{#each data.users.items[selected]?.groups as group}
								<div class="wrapper">
									<Paragraph style="label">{capitalise(group)}</Paragraph>
								</div>
							{/each}
						</div>
					{/if}
					{#if show_groups}
						<div class="editing-groups">
							<Paragraph>Existing groups</Paragraph>
							<div class="groups">
								{#each data.user.groups as group}
									<div class="wrapper">
										<form
											action="?/remove_group"
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
											<input type="hidden" value={group} name="object" />
											<input type="hidden" value={data.user.id} name="subject_id" />
											<Button style="tag" onclick={async () => {}}>{capitalise(group)}</Button>
										</form>
									</div>
								{/each}
							</div>
						</div>
						<div class="editing-groups">
							<Paragraph>Available groups</Paragraph>
							<div class="groups">
								{#each data.groups.filter((group) => !data.user?.groups?.find((ug) => ug === group)) as group}
									<div class="wrapper">
										<form
											action="?/add_group"
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
											<input type="hidden" value={group} name="object" />
											<input type="hidden" value={data.user.id} name="subject_id" />
											<Button style="tag">{capitalise(group)}</Button>
										</form>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				{#if data.answers?.filter((answer) => answer.answer !== null && answer.question !== null).length ?? 0 > 0}
					<div class="section">
						<Subtitle>Answers</Subtitle>
						{#each data.answers as answer}
							<div class="details">
								{#if answer.question}
									<Paragraph>Question: {answer.question.title}</Paragraph>
								{/if}
								{#if answer.answer}
									<Paragraph>Answer: {answer.answer}</Paragraph>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
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

	.details {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
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
	.groups {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.editing-groups {
		background-color: var(--background-muted);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		border-radius: var(--radius);
	}
</style>
