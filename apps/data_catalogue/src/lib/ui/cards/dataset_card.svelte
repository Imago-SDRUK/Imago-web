<script lang="ts">
	import { Paragraph, Button, Icon, Subtitle, ActionBar, Input, Text, Notice } from '@imago/ui'
	import { notify } from '$lib/stores/notify'
	import type { CkanDataset, CkanResource } from '$lib/types/ckan'
	import { fuzzy, jstr } from '@arturoguzman/art-ui'
	import { applyAction, enhance } from '$app/forms'
	import type {
		AvailableActor,
		PermissionActor,
		PermissionQuery
	} from '$lib/server/entities/models/permissions'
	import PermissionForm from './permission_form.svelte'
	import { AVAILABLE_RELATIONS } from '$lib/globals/auth'
	import RelationCard from './relation_card.svelte'
	import { handleEnhance } from '$lib/utils/forms'
	import BaseTable from '../tables/base_table.svelte'
	import type { IColumnConfig } from '@svar-ui/svelte-grid'

	let {
		dataset,
		groups,
		relationships,
		resources = [],
		actors
	}: {
		dataset: CkanDataset
		groups: string[]
		relationships: PermissionActor[]
		resources: (CkanResource & { downloads?: number })[]
		actors: AvailableActor[]
	} = $props()
	let creating_permission = $state(-1)
	let search = $state('')
	let selected: { label: string; actor: PermissionQuery['actor'] }[] = $state([])
	const results = $derived(
		actors
			.filter((actor) => !relationships?.find((relationship) => relationship.label === actor.label))
			.filter((actor) => !selected.find((s) => s.label === actor.label))
			.filter((actor) => fuzzy(search, actor.label))
	)

	const resources_columns: (IColumnConfig & {
		id: keyof (CkanResource & { downloads?: number })
	})[] = [
		{
			id: 'name',
			header: 'Name',
			width: 600
		},
		{
			id: 'downloads',
			header: 'Downloads'
		}
	]
</script>

<div class="user-card">
	<div class="section">
		<div class="section-title">
			<Subtitle size="md">{dataset.title}</Subtitle>
		</div>
		<div class="user-information">
			<Paragraph>ID: {dataset.id}</Paragraph>
			<Paragraph>Name: {dataset.name}</Paragraph>
		</div>
	</div>

	{#if resources.length > 0}
		<div class="section">
			<div class="resources">
				<Subtitle>Resources</Subtitle>
				<BaseTable onopeneditor={() => {}} data={resources} columns={resources_columns}></BaseTable>
			</div>
		</div>
	{/if}
	<div class="section">
		<Subtitle>Metadata groups</Subtitle>
		<div class="editing">
			{#each groups.filter((group) => dataset.groups.find((_g) => _g.id === group.id)) as group}
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
					<input type="hidden" value={dataset.id} name="dataset_id" />
					<input type="hidden" value={group?.id} name="group_id" />
					<Button width="auto">
						<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
						{group?.title}</Button
					>
				</form>
			{/each}
			{#each groups.filter((group) => !dataset.groups.find((_g) => _g.id === group.id)) as group}
				<form action="?/add_group" method="post" use:enhance={handleEnhance()}>
					<input type="hidden" value={dataset.id} name="dataset_id" />
					<input type="hidden" value={group?.id} name="group_id" />

					<Button width="auto">
						<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
						{group?.title}</Button
					>
				</form>
			{/each}
		</div>
	</div>
	<div class="section">
		<div class="section-title"></div>
		<div class="groups">
			<ActionBar>
				{#snippet left()}
					<Subtitle>Permissions</Subtitle>
				{/snippet}
				{#snippet right()}{/snippet}
			</ActionBar>

			<div class="search">
				<div class="search-bar">
					<Input>
						<Text placeholder="Search" name="search" bind:value={search}></Text>
					</Input>
				</div>
				{#if search !== ''}
					<div class="results">
						{#each results as result, index (result)}
							{#if creating_permission === -1 ? true : creating_permission === index}
								<PermissionForm
									bind:creating_permission
									dataset_id={dataset.id}
									actor={result}
									{index}
								></PermissionForm>
							{/if}
						{/each}
						{#if results.length === 0}
							<Notice level="info">
								<Paragraph size="xs">No results for {search}</Paragraph>
							</Notice>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="section">
		{#each AVAILABLE_RELATIONS as ar (ar)}
			{@const relations = relationships?.filter((r) => r.relation === ar.value)}
			<div class="relations">
				<Subtitle>{ar.label}</Subtitle>

				{#if relations?.length > 0}
					<div class="relations">
						{#each relations as relation (relation)}
							<RelationCard {relation} dataset_id={dataset.id}></RelationCard>
						{/each}
					</div>
				{/if}
				{#if relations?.length === 0}
					<Notice level="info">
						<Paragraph size="xs">There are no {ar.label}</Paragraph>
					</Notice>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.user-card {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.section {
		display: grid;
		grid-template-rows: minmax(0, 1fr) minmax(0, max-content);
		gap: 0.25rem;
	}
	.section-title {
		display: flex;
		justify-content: space-between;
	}
	.user-information {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.resources {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		overflow: scroll;
	}

	.groups {
		display: grid;
		gap: 0.25rem;
	}

	.editing {
		background-color: var(--background-muted);
		display: flex;
		gap: 0.5rem;
		padding: 1rem;
		border-radius: var(--radius);
		flex-wrap: wrap;
	}
	.relations {
		display: flex;
		gap: 0.5rem;
		flex-direction: column;
	}
	.search {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.search-bar {
		display: flex;
		gap: 1rem;
	}
	.results {
		max-height: 30lvh;
		overflow-x: hidden;
		overflow-y: scroll;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border: 1px solid var(--border);
		background-color: var(--background-muted);
		padding: 1rem;
	}
</style>
