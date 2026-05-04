<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { getDataset } from '$lib/context/dataset.svelte'
	import { notify } from '$lib/stores/notify'
	import type { FilePreUpload } from '$lib/utils/files/readers'
	import { handleEnhance } from '$lib/utils/forms'
	import { Accordion, Button, Icon, Input, Subtitle, Text, Textarea } from '@imago/ui'

	let {
		file,
		handleDelete
	}: {
		file: FilePreUpload
		handleDelete?: () => void
	} = $props()
	const ctx = getDataset()

	const handleFileUpload = async () => {
		console.log('upload')
		console.log(file)
		// const resource = await file.upload?.fn({
		// 	...file,
		// 	headers: { 'x-ms-blob-type': 'BlockBlob' }
		// })
		// if (resource) {
		// 	handleDelete?.()
		// 	ctx.dataset.resources.push(resource)
		// 	notify.send({ message: `${file.filename} successfully uploaded` })
		// }
	}
</script>

<form
	method="post"
	action="?/upload_file"
	use:enhance={handleEnhance({
		onsuccess: async () => {
			console.log('ok')
		}
	})}
>
	<!-- <input -->
	<!-- 	type="hidden" -->
	<!-- 	name="file" -->
	<!-- 	value={JSON.stringify({ title: file.filename, description: file.description })} -->
	<!-- /> -->
	<div class="file-preview">
		{#if file.upload}
			{#if file.upload.progress.current > 0 && file.upload.status === 'uploading'}
				<div class="progress-bar" style:--progress="{file.upload.progress.current}%">
					<p>{file.upload.progress.current.toFixed(0)}%</p>
				</div>
			{/if}
			{#if file.upload.progress.current === 0 && file.upload.status === 'uploading'}
				<div class="progress-bar" style:--progress="{file.upload.progress.current}%">
					<p>Queued for upload</p>
				</div>
			{/if}
			{#if file.upload.status === 'completed'}
				<div class="progress-bar" style:--progress="{file.upload.progress.current}%">
					<p>File uploaded</p>
				</div>
			{/if}
		{/if}
		<div class="preview">
			<Accordion>
				{#snippet title()}
					<Subtitle>{file.filename}</Subtitle>
				{/snippet}
				{#snippet buttons({ toggleOpen, open })}
					<div class="buttons">
						{#if handleDelete}
							<Button
								style="square"
								type="button"
								onclick={() => {
									handleDelete()
								}}
							>
								<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
							</Button>
						{/if}
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
						<Button
							style="square"
							onclick={async () => {
								await handleFileUpload()
							}}
						>
							<Icon icon={{ icon: 'upload', set: 'tabler' }}></Icon>
						</Button>
					</div>
				{/snippet}
				<input type="hidden" name="package_id" value={page.params.id} />
				<Input label="Name">
					<Text name="title" bind:value={file.filename}></Text>
				</Input>
				<Input label="Description">
					<Textarea name="description" bind:value={file.description}></Textarea>
				</Input>
				<Input label="Format">
					<Text name="type" bind:value={file.type}></Text>
				</Input>
			</Accordion>
		</div>
	</div>
</form>

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
