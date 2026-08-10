<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { createResource } from '$lib/remotes/resources/create.remote'
	import type { ResourceServiceDto } from '$lib/server/entities/models/resources.js'
	import { notify } from '$lib/stores/notify.js'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import Facts from '$lib/ui/cards/facts.svelte'
	import FileInput from '$lib/ui/inputs/file_input.svelte'
	import Upload from '$lib/ui/inputs/upload.svelte'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import CellEditor from '$lib/ui/tables/cell_editor.svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { xhrUpload } from '$lib/utils/files/readers/index.js'
	import { handleEnhance } from '$lib/utils/forms'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import MimeTypes from '$lib/assets/available_mime_types.json'
	import {
		Accordion,
		ActionBar,
		Button,
		Icon,
		Input,
		Notice,
		Numerical,
		Paragraph,
		SectionEdit,
		Select,
		Subtitle,
		Text,
		Textarea
	} from '@imago/ui'
	import type { IColumnConfig } from '@svar-ui/svelte-grid'
	import { updateResourceService } from '$lib/remotes/resources/update.remote.js'
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
		// 'format',
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
								toggleDialog('edit-resource-service')
							}}
						>
							<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
						</Button>

						{#if data.allow_delete}
							<Button
								onclick={() => {
									toggleDialog('delete-resource')
								}}
							>
								<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
							</Button>
						{/if}
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
												toggleDialog('add-version')
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
			<div class="section">
				<ActionBar
					>{#snippet left()}
						<Subtitle>Structural metadata</Subtitle>
					{/snippet}
					{#snippet right()}
						<div class="buttons">
							<Button
								onclick={() => {
									toggleDialog(`reset-datastore-${data.resource?.id}`)
								}}
							>
								<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
							</Button>

							<Button
								onclick={() => {
									toggleDialog(`add-datastore-${data.resource?.id}`)
								}}
							>
								<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
							</Button>
						</div>
					{/snippet}
				</ActionBar>
				{#if data.resource.metadata === null}
					<Notice level="info">
						<Paragraph>No structural metadata has been added</Paragraph>
					</Notice>
				{/if}
				{#if data.resource.metadata !== null}
					<div class="tables">
						{#each data.resource.metadata?.tables as table}
							<BaseTable data={table.tableSchema.columns ?? []} {columns}></BaseTable>
						{/each}
					</div>
				{/if}
				<Dialog id="add-datastore-{data.resource.id}">
					<form
						class="form"
						enctype="multipart/form-data"
						method="post"
						action="?/add_datastore"
						use:enhance={handleEnhance({
							onsuccess: ({ formElement }) => {
								toggleDialog(`add-datastore-${data.resource?.id}`)
								formElement.reset()
							}
						})}
					>
						<input type="hidden" value={data.resource.id} name="id" />
						<div class="fields-block">
							<Subtitle>Upload a metadata JSON file</Subtitle>
							<FileInput label="Metadata file" name="file" enable_previews={false}></FileInput>
						</div>
						<div class="buttons" data-disabled={enable_buttons ? undefined : true}>
							<Button
								type="button"
								onclick={() => {
									toggleDialog(`add-datastore-${data.resource?.id}`)
								}}>Cancel</Button
							>
							<Button>Upload</Button>
						</div>
					</form>
				</Dialog>
				<Dialog id="reset-datastore-{data.resource.id}">
					<form
						class="form"
						method="post"
						action="?/reset_datastore"
						use:enhance={handleEnhance({
							onsuccess: () => {
								toggleDialog(`reset-datastore-${data.resource?.id}`)
							}
						})}
					>
						<input type="hidden" value={data.resource.id} name="id" />
						<Subtitle>Are you sure you want to reset this resource's datastore?</Subtitle>
						<div class="buttons" data-disabled={enable_buttons ? undefined : true}>
							<Button
								type="button"
								onclick={() => {
									toggleDialog(`reset-datastore-${data.resource?.id}`)
								}}>Cancel</Button
							>
							<Button>Reset</Button>
						</div>
					</form>
				</Dialog>
			</div>
		{/if}
	{/snippet}
</SectionEdit>

<Dialog id="edit-resource-service">
	<form
		{...updateResourceService.enhance(async ({ submit }) => {
			const valid = await submit()
			if (valid) {
				toggleDialog('edit-resource-service')
			}
		})}
	>
		<div class="fields">
			<input {...updateResourceService.fields.id.as('hidden', data.resource?.id ?? '')} />

			<Input label="Name">
				{#snippet message()}
					{#each updateResourceService.fields.name.issues() as issue}
						<Paragraph size="xs">{issue.message}</Paragraph>
					{/each}
				{/snippet}
				<Text {...updateResourceService.fields.name.as('text', data.resource?.name ?? '')}></Text>
			</Input>
			<Input label="Description">
				{#snippet message()}
					{#each updateResourceService.fields.description.issues() as issue}
						<Paragraph size="xs">{issue.message}</Paragraph>
					{/each}
				{/snippet}
				<Textarea
					{...updateResourceService.fields.description.as('text', data.resource?.description ?? '')}
				></Textarea>
			</Input>
			<Input label="MIMEType">
				{#snippet message()}
					{#each updateResourceService.fields.mimetype.issues() as issue}
						<Paragraph size="xs">{issue.message}</Paragraph>
					{/each}
				{/snippet}
				<Select
					{...updateResourceService.fields.mimetype.as('select', data.resource?.mimetype ?? '')}
					options={MimeTypes.map((mt) => ({ label: mt.name, value: mt.value }))}
				></Select>
			</Input>
		</div>
		<div class="buttons">
			<Button
				type="button"
				onclick={() => {
					toggleDialog('edit-resource-service')
				}}>Cancel</Button
			>
			<Button>Save</Button>
		</div>
	</form>
</Dialog>

<Dialog id="add-resource">
	<Upload name="resources" label="Add resources">
		{#snippet children({ files, removeFile })}
			{#each files as file, index}
				<!-- <form -->
				<!-- 					method="post" -->
				<!-- 					action="?/add_resource" -->
				<!-- 					use:enhance={handleEnhance({ -->
				<!-- 						onsubmit: () => { -->
				<!-- 							enable_buttons = false -->
				<!-- 						}, -->
				<!-- 						onfailure: async () => { -->
				<!-- 							enable_buttons = true -->
				<!-- 						}, -->
				<!-- 						onsuccess: async ({ result }) => { -->
				<!-- 							if (result.type === 'success') { -->
				<!-- 								if (result.data) { -->
				<!-- 									if ('url' in result.data && typeof result.data.url === 'string') { -->
				<!-- 										await xhrUpload({ -->
				<!-- 											file_preupload: file, -->
				<!-- 											url: result.data.url, -->
				<!-- 											headers: { 'x-ms-blob-type': 'BlockBlob' } -->
				<!-- 										}).catch(() => { -->
				<!-- 											enable_buttons = true -->
				<!-- 											notify.send({ -->
				<!-- 												message: `There's been an issue uploading this file, please try to add the version again` -->
				<!-- 											}) -->
				<!-- 											toggleDialog('add-resource') -->
				<!-- 											return -->
				<!-- 										}) -->
				<!---->
				<!-- 										enable_buttons = true -->
				<!-- 										notify.send({ message: `${file.filename} successfully uploaded` }) -->
				<!-- 										toggleDialog('add-resource') -->
				<!-- 									} -->
				<!-- 								} -->
				<!-- 							} -->
				<!-- 						} -->
				<!-- 					})} -->
				<!-- 				> -->
				<!-- 					<div class="file-preview"> -->
				<!-- 						{#if file.upload} -->
				<!-- 							{#if file.upload.progress.current > 0 && file.upload.status === 'uploading'} -->
				<!-- 								<div class="progress-bar" style:--progress="{file.upload.progress.current}%"> -->
				<!-- 									<p>{file.upload.progress.current.toFixed(0)}%</p> -->
				<!-- 								</div> -->
				<!-- 							{/if} -->
				<!-- 							{#if file.upload.progress.current === 0 && file.upload.status === 'uploading'} -->
				<!-- 								<div class="progress-bar" style:--progress="{file.upload.progress.current}%"> -->
				<!-- 									<p>Queued for upload</p> -->
				<!-- 								</div> -->
				<!-- 							{/if} -->
				<!-- 							{#if file.upload.status === 'completed'} -->
				<!-- 								<div class="progress-bar" style:--progress="{file.upload.progress.current}%"> -->
				<!-- 									<p>File uploaded</p> -->
				<!-- 								</div> -->
				<!-- 							{/if} -->
				<!-- 						{/if} -->
				<!-- 						<div class="preview"> -->
				<!-- 							<Subtitle>{file.filename}</Subtitle> -->
				<!-- 							<input type="hidden" name="package_id" value={data.dataset.id} /> -->
				<!-- 							<Input label="Name"> -->
				<!-- 								<Text name="name" bind:value={file.filename}></Text> -->
				<!-- 							</Input> -->
				<!-- 							<Input label="Description"> -->
				<!-- 								<Textarea name="description" bind:value={file.description}></Textarea> -->
				<!-- 							</Input> -->
				<!-- 							<Input label="Format"> -->
				<!-- 								<Text name="type" bind:value={file.type}></Text> -->
				<!-- 							</Input> -->
				<!-- 							<Input label="Version"> -->
				<!-- 								<Text name="version"></Text> -->
				<!-- 							</Input> -->
				<!-- 							<Input label="Changelog"> -->
				<!-- 								<Textarea name="changelog"></Textarea> -->
				<!-- 							</Input> -->
				<!-- 						</div> -->
				<!-- 					</div> -->
				<!-- 					<div class="buttons" data-disabled={enable_buttons ? undefined : true}> -->
				<!-- 						<Button -->
				<!-- 							type="button" -->
				<!-- 							onclick={() => { -->
				<!-- 								removeFile({ index }) -->
				<!-- 								toggleDialog('add-resource') -->
				<!-- 							}}>Cancel</Button -->
				<!-- 						> -->
				<!-- 						<Button>Upload</Button> -->
				<!-- 					</div> -->
				<!-- 				</form> -->
				<!-- 			{/each} -->
				<!-- 			{#if files.length === 0} -->
				<!-- 				<div class="buttons"> -->
				<!-- 					<Button -->
				<!-- 						type="button" -->
				<!-- 						onclick={() => { -->
				<!-- 							toggleDialog('add-resource') -->
				<!-- 						}}>Cancel</Button -->
				<!-- 					> -->
				<!-- 				</div> -->
				<!-- 			{/if} -->

				<form
					{...createResource.enhance(async ({ submit }) => {
						enable_buttons = false
						const valid = await submit()
						if (valid) {
							const result = createResource.result
							if (result?.url) {
								await xhrUpload({
									file_preupload: file,
									url: result.url,
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
						enable_buttons = true
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
							<!-- <Subtitle>{file.filename}</Subtitle> -->
							<input type="hidden" name="package_id" value={data.dataset.id} />
							<Input label="Name">
								{#snippet message()}
									{#each createResource.fields.name.issues() as issue}
										<Paragraph size="xs">{issue.message}</Paragraph>
									{/each}
								{/snippet}
								<Text {...createResource.fields.name.as('text')}></Text>
							</Input>
							<Input label="Description">
								{#snippet message()}
									{#each createResource.fields.description.issues() as issue}
										<Paragraph size="xs">{issue.message}</Paragraph>
									{/each}
								{/snippet}
								<Textarea {...createResource.fields.description.as('text')}></Textarea>
							</Input>
							<Input label="Format">
								{#snippet message()}
									{#each createResource.fields.mimetype.issues() as issue}
										<Paragraph size="xs">{issue.message}</Paragraph>
									{/each}
								{/snippet}
								<Select
									{...createResource.fields.mimetype.as('select', file.type)}
									options={MimeTypes.map((mt) => ({ label: mt.name, value: mt.value }))}
								></Select>
								<!-- <Text {...createResource.fields.mimetype.as('text', file.type)}></Text> -->
							</Input>

							<Input label="Size">
								{#snippet message()}
									{#each createResource.fields.size.issues() as issue}
										<Paragraph size="xs">{issue.message}</Paragraph>
									{/each}
								{/snippet}
								<Numerical {...createResource.fields.size.as('number', file.size)}></Numerical>
							</Input>
							<Input label="Version">
								{#snippet message()}
									{#each createResource.fields.version.issues() as issue}
										<Paragraph size="xs">{issue.message}</Paragraph>
									{/each}
								{/snippet}
								<Text {...createResource.fields.version.as('text')}></Text>
							</Input>
							<Input label="Changelog">
								{#snippet message()}
									{#each createResource.fields.changelog.issues() as issue}
										<Paragraph size="xs">{issue.message}</Paragraph>
									{/each}
								{/snippet}
								<Textarea {...createResource.fields.changelog.as('text')}></Textarea>
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
	.tables {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.fields {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
