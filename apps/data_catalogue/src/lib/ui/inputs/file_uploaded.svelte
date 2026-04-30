<script lang="ts">
	import type { CkanResource } from '$lib/types/ckan'
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { notify } from '$lib/stores/notify'
	import { Accordion, Button, Checkbox, Icon, Input, Subtitle, Text, Textarea } from '@imago/ui'
	import { getDataset } from '$lib/context/dataset.svelte'
	import FileInput from './file_input.svelte'
	import { handleEnhance } from '$lib/utils/forms'
	import { xhrUpload } from '$lib/utils/files/readers'
	import VersionUpload from './version_upload.svelte'

	let {
		file,
		index
	}: {
		file: CkanResource
		index: number
	} = $props()
	const ctx = getDataset()
	let state: 'idle' | 'predelete' | 'edit' | 'versions' | 'metadata' | 'edit' = $state('idle')
	const handleOpen = (
		_state: 'idle' | 'predelete' | 'edit' | 'versions' | 'metadata' | 'edit',
		fn: () => void
	) => {
		if (state === _state) {
			state = 'idle'
		} else {
			state = _state
		}
		fn()
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
					{#if state === 'predelete'}
						<Button
							style="clean"
							type="button"
							onclick={() => {
								state = 'idle'
							}}
						>
							Cancel
						</Button>
						<form action="?/delete_resource" method="post" use:enhance={handleEnhance()}>
							<input type="hidden" name="resource_id" value={file.id} />
							<Button active={open} style="clean">Confirm</Button>
						</form>
					{/if}
					{#if state === 'edit' || state === 'metadata' || state === 'versions' || state === 'idle'}
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
							active={state === 'versions'}
							style="square"
							type="button"
							onclick={() => {
								handleOpen('versions', toggleOpen)
							}}
						>
							<Icon icon={{ icon: 'versions', set: 'tabler' }}></Icon>
						</Button>

						<Button
							active={state === 'metadata'}
							style="square"
							type="button"
							onclick={() => {
								handleOpen('metadata', toggleOpen)
							}}
						>
							<Icon icon={{ icon: 'table-plus', set: 'tabler' }}></Icon>
						</Button>
						<Button
							active={state === 'edit'}
							style="square"
							type="button"
							onclick={() => {
								handleOpen('edit', toggleOpen)
							}}
						>
							<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
						</Button>
					{/if}
				</div>
			{/snippet}
			{#if state === 'edit'}
				<div class="forms">
					<form method="post" action="?/update_resource" use:enhance={handleEnhance()}>
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
				</div>
			{/if}
			{#if state === 'versions'}
				<Subtitle>Add a version</Subtitle>
				<VersionUpload resource_id={file.id}></VersionUpload>
			{/if}
			{#if state === 'metadata'}
				<Subtitle>Add structural metadata</Subtitle>
				<form
					method="post"
					action="?/update_datastore"
					enctype="multipart/form-data"
					use:enhance={handleEnhance()}
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
			{/if}
			<div class="forms"></div>
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
