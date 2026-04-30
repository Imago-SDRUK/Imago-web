<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import type { ResourceVersionRequest } from '$lib/server/entities/models/resources'
	// import { invalidateAll } from '$app/navigation'
	import { xhrUpload, type FileUpload } from '$lib/utils/files/readers'
	import { handleEnhance } from '$lib/utils/forms'
	import { Button, Input, Text, Textarea } from '@imago/ui'
	import { Tween } from 'svelte/motion'
	import FileInput from './file_input.svelte'
	let { resource_id }: { resource_id: string } = $props()
	const r_id = () => resource_id
	let file: File | null = $state(null)
	const version: Partial<ResourceVersionRequest> = $state({
		resource: r_id(),
		version: '',
		changelog: ''
	})
	let upload: FileUpload = $state({
		progress: new Tween(0),
		status: 'idle',
		value: ''
	})

	// 	headers: { 'x-ms-blob-type': 'BlockBlob' }
</script>

<!-- <input -->
<!-- 	type="hidden" -->
<!-- 	name="file" -->
<!-- 	value={JSON.stringify({ title: file.filename, description: file.description })} -->
<!-- /> -->
<FileInput
	label="File"
	enable_previews={false}
	onchange={(e) => {
		if (e.currentTarget.files && e.currentTarget.files.length > 0) {
			file = e.currentTarget.files[0]
			return
		}
	}}
	ondrop={(e) => {
		if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
			file = e.dataTransfer.files[0]
			return
		}
	}}
></FileInput>
{#if file !== null}
	<div class="file-preview">
		{#if upload.progress.current > 0 && upload.status === 'uploading'}
			<div class="progress-bar" style:--progress="{upload.progress.current}%">
				<p>{upload.progress.current.toFixed(0)}%</p>
			</div>
		{/if}
		{#if upload.progress.current === 0 && upload.status === 'uploading'}
			<div class="progress-bar" style:--progress="{upload.progress.current}%">
				<p>Queued for upload</p>
			</div>
		{/if}
		{#if upload.status === 'completed'}
			<div class="progress-bar" style:--progress="{upload.progress.current}%">
				<p>File uploaded</p>
			</div>
		{/if}
		<div class="preview">
			<form
				method="post"
				action="?/add_version"
				use:enhance={handleEnhance({
					onsuccess: async ({ result }) => {
						if (result.type === 'success') {
							if (result.data) {
								const url = result.data.url
								if (typeof url === 'string' && file) {
									await xhrUpload({
										file,
										upload,
										url,
										headers: { 'x-ms-blob-type': 'BlockBlob' }
									})
								}
							}
						}
					}
				})}
			>
				<input type="text" hidden bind:value={resource_id} name="resource_id" />
				<div class="inputs">
					<Input label="Version">
						<Text name="version"></Text>
					</Input>
					<Input label="Changelog">
						<Textarea name="changelog"></Textarea>
					</Input>
				</div>
				<div class="buttons">
					<!-- <Button -->
					<!-- 	type="button" -->
					<!-- 	onclick={() => { -->
					<!-- 		invalidateAll() -->
					<!-- 	}}>Cancel</Button -->
					<!-- > -->
					<Button>Upload</Button>
				</div>
			</form>
			<input type="hidden" name="package_id" value={page.params.id} />
		</div>
	</div>
{/if}

<style>
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
		gap: 0.25rem;
	}
	.progress-bar {
		position: relative;
		width: 100%;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		font-family: var(--accent);
		font-size: 0.7rem;
	}
	.progress-bar::before {
		content: '';
		background-color: var(--highlight);
		position: absolute;
		top: 0;
		left: 0;
		width: var(--progress);
		height: 100%;
		transition: all 0.1s linear;
	}
	.progress-bar p {
		color: var(--text);
		background-color: color-mix(in oklab, var(--background-muted) 50%, transparent 50%);
		padding: 0 1rem;
		z-index: 1;
	}
</style>
