<script lang="ts">
	import type { CkanResource } from '$lib/types/ckan'
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { notify } from '$lib/stores/notify'
	import { Accordion, Button, Checkbox, Icon, Input, Subtitle, Text, Textarea } from '@imago/ui'
	import { getDataset } from '$lib/context/dataset.svelte'
	import FileInput from './file_input.svelte'

	let {
		file,
		index
	}: {
		file: CkanResource
		index: number
	} = $props()
	const ctx = getDataset()
	let state: 'idle' | 'predelete' = $state('idle')
	const handleDelete = async () => {
		const res = await fetch(`/api/v1/resources/${file.id}`, { method: 'DELETE' })
		if (res.status === 201) {
			notify.send(`${file.name} has been deleted.`)
			ctx.dataset.resources = [
				...ctx.dataset.resources.slice(0, index),
				...ctx.dataset.resources.slice(index + 1)
			]
			return
		}
		notify.send(res.statusText)
	}
</script>

<div class="file">
	<div class="preview">
		<Accordion>
			{#snippet title()}
				{#if state === 'predelete'}
					<Subtitle>Are you sure you want to delete this file?</Subtitle>
				{/if}
				{#if state === 'idle'}
					<Subtitle>{file.name}</Subtitle>
				{/if}
			{/snippet}
			{#snippet buttons({ toggleOpen, open })}
				<div class="buttons">
					{#if state === 'predelete' && handleDelete}
						<Button
							style="clean"
							type="button"
							onclick={() => {
								state = 'idle'
							}}
						>
							Cancel
						</Button>
						<Button
							active={open}
							style="clean"
							type="button"
							onclick={() => {
								handleDelete()
							}}
						>
							Confirm
						</Button>
					{/if}
					{#if state === 'idle'}
						<Button
							style="square"
							type="button"
							onclick={() => {
								if (open) {
									toggleOpen()
								}
								state = 'predelete'
							}}
						>
							<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
						</Button>
						<Button
							active={open}
							style="square"
							type="button"
							onclick={() => {
								toggleOpen()
							}}
						>
							<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
						</Button>
					{/if}
				</div>
			{/snippet}
			<div class="forms">
				<form
					method="post"
					action="?/update_resource"
					use:enhance={() => {
						return async ({ result }) => {
							if ('data' in result) {
								notify.send(String(result.data.message))
							}
							await invalidateAll()
						}
					}}
				>
					<input type="text" hidden bind:value={file.id} name="id" />

					<div class="inputs">
						<Input label="Name">
							<Text name="name" bind:value={file.name}></Text>
						</Input>
						<Input label="Description">
							<Textarea name="description" bind:value={file.description}></Textarea>
						</Input>
						<Input label="Format">
							<Text name="format" bind:value={file.format}></Text>
						</Input>
					</div>
					<div class="buttons">
						<Button
							type="button"
							onclick={() => {
								invalidateAll()
							}}>Cancel</Button
						>
						<Button>Submit</Button>
					</div>
				</form>
				<form
					method="post"
					action="?/update_datastore"
					enctype="multipart/form-data"
					use:enhance={() => {
						return async ({ result }) => {
							if ('data' in result) {
								notify.send(String(result.data.message))
							}
							await invalidateAll()
						}
					}}
				>
					<input type="text" hidden bind:value={file.id} name="id" />
					<div class="inputs">
						<FileInput label="Structural metadata" name="file" enable_previews={false}></FileInput>
						<Input label="Override fields">
							<Checkbox name="override"></Checkbox>
						</Input>
					</div>
					<div class="buttons">
						<Button
							type="button"
							onclick={() => {
								invalidateAll()
							}}>Cancel</Button
						>
						<Button>Submit</Button>
					</div>
				</form>
			</div>
			<!-- <Button -->
			<!-- 	onclick={async () => { -->
			<!-- 		await fetch(`/api/v1/resources/${file.id}/datastore`, { method: 'POST' }) -->
			<!-- 			.then((res) => res.json()) -->
			<!-- 			.then((res) => console.log(res)) -->
			<!-- 			.catch((err) => console.log(err)) -->
			<!-- 	}}>Upload datastore</Button -->
			<!-- > -->
		</Accordion>
	</div>
</div>

<style>
	form {
		display: grid;
		gap: 1rem;
		grid-auto-flow: row;
	}
	.preview {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		width: 100%;
		gap: 1rem;
		flex-shrink: 0;
		background-color: var(--background);
		padding: 1rem;
		border-radius: var(--radius);
		position: relative;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.forms {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
