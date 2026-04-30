<script lang="ts">
	import { enhance } from '$app/forms'
	import { AVAILABLE_RELATIONS } from '$lib/globals/auth'
	import type { PermissionActor } from '$lib/server/entities/models/permissions'
	import { handleEnhance } from '$lib/utils/forms'
	import { Button, Icon, Paragraph, Select } from '@imago/ui'

	let {
		relation,
		dataset_id
	}: {
		relation: PermissionActor
		dataset_id: string
	} = $props()

	let open = $state(false)
	const previous = structuredClone(relation)
</script>

<div class="relation-card" data-open={open ? true : undefined}>
	{#if !open}
		<Button
			style="tag"
			width="auto"
			onclick={() => {
				open = true
			}}
		>
			<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
			<Paragraph size="xs">{relation.label}</Paragraph>
		</Button>
	{/if}
	{#if open}
		<div class="header">
			<Paragraph>{relation.label}</Paragraph>

			<form action="?/delete_permission" method="post" use:enhance={handleEnhance()}>
				<input type="hidden" value={relation.relation} name="relation" />
				<input type="hidden" value={JSON.stringify(relation.actor)} name="actor" />
				<input type="hidden" value={dataset_id} name="dataset_id" />
				<Button>
					<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
				</Button>
			</form>
		</div>
		<form action="?/edit_permission" method="post" use:enhance={handleEnhance()}>
			<input type="hidden" value={JSON.stringify(previous)} name="previous" />
			<input type="hidden" value={dataset_id} name="dataset_id" />
			<input type="hidden" value={JSON.stringify(relation.actor)} name="actor" />
			<Select
				label="Relation"
				name="relation"
				options={AVAILABLE_RELATIONS}
				required
				value={relation.relation}
			></Select>
			<div class="buttons">
				<Button
					width="auto"
					type="button"
					onclick={() => {
						open = false
					}}
				>
					Cancel</Button
				>
				<Button width="auto">Save</Button>
			</div>
		</form>
	{/if}
</div>

<style>
	.header {
		display: flex;
		justify-content: space-between;
	}
	.relation-card[data-open] {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background-color: var(--background-muted);
		padding: 1rem;
		border: 1px solid var(--border);
	}
	form {
		display: flex;
		gap: 0.5rem;
		flex-direction: column;
	}
	.buttons {
		display: flex;
		gap: 0.5rem;
		justify-content: space-between;
	}
</style>
