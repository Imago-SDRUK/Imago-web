<script lang="ts">
	import { onMount, type Snippet } from 'svelte'
	import type { ChangeEventHandler } from 'svelte/elements'
	import { Input, Subtitle } from '@imago/ui'
	import { getId, jstr } from '@arturoguzman/art-ui'
	import { addFiles, readFile, type FilePreUpload } from '$lib/utils/files/readers'
	import FilePreview from './file_preview.svelte'
	let {
		label,
		name,
		value = null,
		status = $bindable('idle')
	}: {
		label?: string
		name?: string
		children?: Snippet
		onchange?: ChangeEventHandler<HTMLInputElement>
		value?: string | null
		status?: 'idle' | 'completed' | 'error' | 'uploading'
	} = $props()
	const id = getId()
	let dropping = $state(false)
	let previews: FilePreUpload[] = $state([])
	const removeFile = ({ index }: { index: number }) => {
		previews = [...previews.slice(0, index), ...previews.slice(index + 1)]
		const e = document.querySelector(`#drop-${name}-${id}`) as HTMLInputElement | null
		if (e) {
			const dt = new DataTransfer()
			for (const file of previews) {
				if (file.file) dt.items.add(file.file)
			}
			e.files = dt.files
		}
	}

	const handleChange = async (e: EventTarget & HTMLInputElement) => {
		const files = e.files
		if (files) {
			for (const file of files) {
				readFile({ file, handleFileReader: addFiles({ previews }) })
			}
		}
	}

	const handlePointerOver = (action: string) => {
		if (action === 'enter') {
			dropping = true
		}
		if (action === 'leave') {
			dropping = false
		}
	}

	onMount(() => {
		status = 'idle'
	})
</script>

<Input {label}>
	<div class="upload">
		<input type="text" {value} {name} hidden />
		<div
			role="none"
			class:drop-bg={dropping}
			class="upload-card"
			data-status={status}
			ondragover={(e) => {
				e.stopPropagation()
				e.preventDefault()
			}}
			ondragenter={(e) => {
				e.stopPropagation()
				handlePointerOver('enter')
			}}
			ondragleave={(e) => {
				e.stopPropagation()
				handlePointerOver('leave')
			}}
			ondrop={async (e) => {
				e.stopPropagation()
				e.preventDefault()
				handlePointerOver('leave')
				e.currentTarget.classList.remove('dropping')
				const input = document.querySelector(`#drop-${name}-${id}`) as HTMLInputElement | null
				if (input) {
					input.files = e.dataTransfer ? e.dataTransfer.files : null
					handleChange(input)
				}
			}}
		>
			<div class="drop-zone" class:pointer-events-none={dropping} class:dropping>
				<div class="file-drop">
					<Subtitle text="Drop your file here or"></Subtitle>
					<input
						id="drop-{name}-{id}"
						multiple
						onchange={async (e) => {
							handleChange(e.currentTarget)
						}}
						class="input-file"
						type="file"
					/>
				</div>
			</div>
		</div>
		{#if previews.length > 0}
			<div class="previews">
				{#each previews as file, index}
					<FilePreview
						{file}
						handleDelete={() => {
							removeFile({ index })
						}}
					></FilePreview>
				{/each}
			</div>
		{/if}
	</div>
</Input>

<style>
	.upload {
		position: relative;
		border: 1px solid var(--border);
		border-radius: var(--radius);
	}

	.upload-card {
		width: 100%;
		height: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		font-family: var(--paragraph);
		transition: all 0.3s ease-in-out;
		overflow: hidden;
	}
	[data-status='error'] {
		background-color: color-mix(in oklab, var(--background) 90%, red 10%);
	}
	[data-status='idle'] {
		background-color: initial;
	}
	[data-status='completed'] {
		background-color: initial;
	}
	.pointer-events-none {
		pointer-events: none;
	}
	.input-file {
		color: var(--text);
		font-family: var(--paragraph);
	}
	.drop {
		color: var(--background);
		font-family: var(--title);
		font-weight: 600;
	}
	.drop-zone {
		margin: 0.5rem 0 1rem 0;
	}
	input[type='file'] {
		border: 1px solid var(--border);
		border-radius: 1rem;
		padding: 0 0.5rem 0 0;
		font-size: clamp(0.875rem, 0.858rem + 0.083vw, 0.925rem);
	}
	input[type='file']::file-selector-button {
		margin-right: 2rem;
		border: none;
		background: var(--text);
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		color: var(--background);
		cursor: pointer;
		transition: background 0.2s ease-in-out;
		font-family: var(--paragraph);
	}
	.dropping {
		filter: blur(5px);
	}
	.drop-bg {
		background-color: color-mix(in oklab, var(--text) 40%, var(--background) 60%);
	}
	.file-drop {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.previews {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow: scroll;
		width: 100%;
		scrollbar-width: none;
		padding: 1rem;
		max-height: 60lvh;
		background-color: var(--background-muted);
	}
	@keyframes enter {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
