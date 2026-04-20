<script lang="ts">
	import { enhance } from '$app/forms'
	import { AVAILABLE_RELATIONS } from '$lib/globals/auth'
	import type { AvailableActor } from '$lib/server/entities/models/permissions'
	import { handleEnhance } from '$lib/utils/forms'
	import { jstr } from '@arturoguzman/art-ui'
	import { Button, Icon, Select, Subtitle } from '@imago/ui'
	let {
		creating_permission = $bindable(),
		actor,
		dataset_id,
		index
	}: {
		creating_permission: number
		dataset_id: string
		actor: AvailableActor
		index: number
	} = $props()
	let open = $derived(creating_permission === index)
</script>

<div class="permission-form" data-open={open ? open : undefined}>
	{#if !open}
		<Button
			width="auto"
			onclick={() => {
				creating_permission = index
			}}
		>
			<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
			{actor.label}</Button
		>
	{/if}
	{#if open}
		<Subtitle>{actor.label}</Subtitle>
		<form
			action="?/add_permission"
			method="post"
			use:enhance={handleEnhance({
				onsuccess: async () => {
					open = false
					creating_permission = -1
				}
			})}
		>
			<input type="hidden" value={dataset_id} name="dataset_id" />
			<input type="hidden" value={JSON.stringify(actor.actor)} name="actor" />
			<Select label="Relation" name="relation" options={AVAILABLE_RELATIONS} required></Select>
			<div class="buttons">
				<Button
					width="auto"
					type="button"
					onclick={() => {
						creating_permission = -1
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
	.permission-form[data-open] {
		display: flex;
		gap: 0.5rem;
		flex-direction: column;
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
