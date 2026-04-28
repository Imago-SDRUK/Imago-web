<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import type { ResourceServiceDto } from '$lib/server/entities/models/resources.js'
	import { notify } from '$lib/stores/notify.js'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import Facts from '$lib/ui/cards/facts.svelte'
	import Upload from '$lib/ui/inputs/upload.svelte'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import CellEditor from '$lib/ui/tables/cell_editor.svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { xhrUpload } from '$lib/utils/files/readers/index.js'
	import { handleEnhance } from '$lib/utils/forms'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import { capitalise, jstr } from '@arturoguzman/art-ui'
	import {
		Accordion,
		ActionBar,
		Button,
		Icon,
		Input,
		Paragraph,
		SectionEdit,
		Subtitle,
		Text,
		Textarea
	} from '@imago/ui'
	import type { IColumnConfig } from '@svar-ui/svelte-grid'
	let { data } = $props()
	const columns: (IColumnConfig & { id: keyof ResourceServiceDto })[] = [
		{
			id: 'name',
			header: 'Name',
			cell: CellEditor
		},
		{
			id: 'description',
			header: 'Description',
			cell: CellText,
			width: 400
		},
		{
			id: 'mimetype',
			header: 'MIMEType',
			cell: CellText
		},
		{
			id: 'created',
			header: 'Created at',
			cell: CellText,
			width: 400
		}
	]
	const keys: (keyof ResourceServiceDto)[] = [
		'name',
		'created',
		'format',
		'id',
		'mimetype',
		'size',
		'description',
		'package_id'
	]
	let enable_buttons = $state(true)
</script>

<SectionEdit open={data.resource ? true : undefined}>
	{#snippet leftCol()}
		<div class="section">
			<header>
				<Subtitle size="lg">Resources</Subtitle>
				<Button
					onclick={() => {
						toggleDialog('add-resource')
					}}
				>
					Create a resource
					<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
				</Button>
			</header>
			{#if data.dataset.resources.length === 0}
				<Paragraph>No resources have been added to this dataset</Paragraph>
			{:else}
				<div class="table">
					<BaseTable data={data.dataset.resources} {columns}></BaseTable>
				</div>
			{/if}
		</div>
	{/snippet}
	{#snippet rightCol()}
		{#if data.resource}
			<div class="section">
				<ActionBar>
					{#snippet left()}
						<Button href={page.url.pathname}>
							<Icon icon={{ icon: 'arrow-left-01', set: 'hugeicons' }}></Icon>
						</Button>
					{/snippet}
					{#snippet centre()}
						<Subtitle>{data.resource?.name}</Subtitle>
					{/snippet}
					{#snippet right()}
						<Button
							onclick={() => {
								toggleDialog('delete-resource')
							}}
						>
							<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
				</ActionBar>

				<Facts record={data.resource ?? {}} {keys}></Facts>

				<div class="versions">
					<ActionBar>
						{#snippet left()}
							<Subtitle>Versions</Subtitle>
						{/snippet}
						{#snippet right()}
							<Button
								onclick={() => {
									toggleDialog('add-version')
								}}
							>
								<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
							</Button>
						{/snippet}
					</ActionBar>

					<Dialog id="add-version">
						<Upload name="resources" label="Add resources">
							{#snippet children({ files, removeFile })}
								{#each files as file, index}
									<form
										method="post"
										action="?/add_version"
										use:enhance={handleEnhance({
											onsubmit: () => {
												enable_buttons = false
											},
											onfailure: async () => {
												enable_buttons = true
											},
											onsuccess: async ({ result }) => {
												if (result.type === 'success') {
													if (result.data) {
														if ('url' in result.data && typeof result.data.url === 'string') {
															await xhrUpload({
																file_preupload: file,
																url: result.data.url,
																headers: { 'x-ms-blob-type': 'BlockBlob' }
															}).catch(() => {
																enable_buttons = true
																notify.send({
																	message: `There's been an issue uploading this file, please try again`
																})
																toggleDialog('add-version')
																return
															})

															enable_buttons = true
															notify.send({ message: `${file.filename} successfully uploaded` })
															toggleDialog('add-version')
														}
													}
													removeFile({ index })
												}
											}
										})}
									>
										{#if file.upload}
											{#if file.upload.progress.current > 0 && file.upload.status === 'uploading'}
												<div
													class="progress-bar"
													style:--progress="{file.upload.progress.current}%"
												>
													<p>{file.upload.progress.current.toFixed(0)}%</p>
												</div>
											{/if}
											{#if file.upload.progress.current === 0 && file.upload.status === 'uploading'}
												<div
													class="progress-bar"
													style:--progress="{file.upload.progress.current}%"
												>
													<p>Queued for upload</p>
												</div>
											{/if}
											{#if file.upload.status === 'completed'}
												<div
													class="progress-bar"
													style:--progress="{file.upload.progress.current}%"
												>
													<p>File uploaded</p>
												</div>
											{/if}
										{/if}
										<input type="hidden" name="resource_id" value={data.resource?.id} />
										<Input label="Version">
											<Text name="version"></Text>
										</Input>
										<Input label="Changelog">
											<Textarea name="changelog"></Textarea>
										</Input>

										<div class="buttons" data-disabled={enable_buttons ? undefined : true}>
											<Button
												type="button"
												onclick={() => {
													toggleDialog('add-version')
													removeFile({ index })
												}}>Cancel</Button
											>
											<Button>Upload</Button>
										</div>
									</form>
								{/each}
								{#if files.length === 0}
									<div class="buttons">
										<Button
											type="button"
											onclick={() => {
												toggleDialog('add-resource')
											}}>Cancel</Button
										>
									</div>
								{/if}
							{/snippet}
						</Upload>
					</Dialog>
					{#each data.resource.versions as version}
						<Dialog id="delete-version">
							<form
								class="version"
								method="post"
								action="?/delete_version"
								use:enhance={handleEnhance({
									onsuccess: async () => {
										toggleDialog('delete-version')
									}
								})}
							>
								<input type="hidden" name="version_id" value={version.id} />
								<Subtitle>Are you sure you want to delete this version?</Subtitle>
								<Facts record={version} keys={['version', 'changelog']}></Facts>

								<div class="buttons">
									<Button
										type="button"
										onclick={() => {
											toggleDialog('delete-version')
										}}>Cancel</Button
									>
									<Button>Delete</Button>
								</div>
							</form>
						</Dialog>
						<div class="version-accordion">
							<Accordion>
								{#snippet title({ toggleOpen })}
									<Button
										style="clean"
										onclick={() => {
											toggleOpen()
										}}
									>
										<Paragraph>Version: {version.version}</Paragraph>
									</Button>
								{/snippet}
								{#snippet buttons({ toggleOpen, open })}
									<Button
										active={open}
										style="clean"
										onclick={() => {
											toggleOpen()
										}}
									>
										<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
									</Button>
								{/snippet}
								<div class="buttons">
									<Subtitle>Information</Subtitle>
									<Button
										onclick={() => {
											toggleDialog('delete-version')
										}}
									>
										<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
									</Button>
								</div>
								<form
									class="version"
									action="?/update_version"
									method="post"
									use:enhance={handleEnhance()}
								>
									<input type="hidden" name="version_id" value={version.id} />
									<Input label="Version">
										<Text name="version" value={version.version}></Text>
									</Input>
									<Input label="Changelog">
										<Textarea name="changelog" value={version.changelog}></Textarea>
									</Input>
									<div class="buttons">
										<Button>Save</Button>
									</div>
								</form>
							</Accordion>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/snippet}
</SectionEdit>

<Dialog id="add-resource">
	<Upload name="resources" label="Add resources">
		{#snippet children({ files, removeFile })}
			{#each files as file, index}
				<form
					method="post"
					action="?/add_resource"
					use:enhance={handleEnhance({
						onsubmit: () => {
							enable_buttons = false
						},
						onfailure: async () => {
							enable_buttons = true
						},
						onsuccess: async ({ result }) => {
							if (result.type === 'success') {
								if (result.data) {
									if ('url' in result.data && typeof result.data.url === 'string') {
										await xhrUpload({
											file_preupload: file,
											url: result.data.url,
											headers: { 'x-ms-blob-type': 'BlockBlob' }
										}).catch(() => {
											enable_buttons = true
											notify.send({
												message: `There's been an issue uploading this file, please try to add the version again`
											})
											toggleDialog('add-resource')
											return
										})

										enable_buttons = true
										notify.send({ message: `${file.filename} successfully uploaded` })
										toggleDialog('add-resource')
									}
								}
							}
						}
					})}
				>
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
							<Subtitle>{file.filename}</Subtitle>
							<input type="hidden" name="package_id" value={page.params.id} />
							<Input label="Name">
								<Text name="name" bind:value={file.filename}></Text>
							</Input>
							<Input label="Description">
								<Textarea name="description" bind:value={file.description}></Textarea>
							</Input>
							<Input label="Format">
								<Text name="type" bind:value={file.type}></Text>
							</Input>
							<Input label="Version">
								<Text name="version"></Text>
							</Input>
							<Input label="Changelog">
								<Textarea name="changelog"></Textarea>
							</Input>
						</div>
					</div>
					<div class="buttons" data-disabled={enable_buttons ? undefined : true}>
						<Button
							type="button"
							onclick={() => {
								removeFile({ index })
								toggleDialog('add-resource')
							}}>Cancel</Button
						>
						<Button>Upload</Button>
					</div>
				</form>
			{/each}
			{#if files.length === 0}
				<div class="buttons">
					<Button
						type="button"
						onclick={() => {
							toggleDialog('add-resource')
						}}>Cancel</Button
					>
				</div>
			{/if}
		{/snippet}
	</Upload>
</Dialog>

<Dialog id="delete-resource">
	<form
		class="section"
		method="post"
		action="?/delete_resource"
		use:enhance={handleEnhance({
			onsuccess: async () => {
				await goto(page.url.pathname)
				toggleDialog('delete-resource')
			}
		})}
	>
		<input type="hidden" name="resource_id" value={data.resource?.id} />
		<Subtitle>Are you sure you want to delete this resource?</Subtitle>
		<Facts record={data.resource ?? {}} {keys}></Facts>
		<div class="buttons">
			<Button
				type="button"
				onclick={() => {
					toggleDialog('delete-resource')
				}}>Cancel</Button
			>
			<Button>Delete</Button>
		</div>
	</form>
</Dialog>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}
	.section {
		background-color: var(--background);
		padding: 2rem;
		border-radius: var(--radius);
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.table {
		background-color: var(--background-muted);
	}
	.versions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		/* background-color: var(--background); */
	}
	.version-accordion {
		background-color: var(--background-muted);
		border-radius: var(--radius);
		padding: 0.5rem;
	}
	.version {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.preview {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		width: 100%;
		gap: 0.5rem;
		flex-shrink: 0;
		/* background-color: var(--background); */
		padding: 1rem;
		border-radius: var(--radius);
		position: relative;
	}
	.buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}
	.buttons[data-disabled] {
		pointer-events: none;
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
