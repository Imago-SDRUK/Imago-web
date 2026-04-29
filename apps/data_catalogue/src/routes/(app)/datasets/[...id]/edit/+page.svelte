<script lang="ts">
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import licenses from '$lib/utils/ckan/licenses.json'
	import { BaseSection, Button, Editor, Input, InputBlock, Select, Subtitle, Text } from '@imago/ui'
	import { getDataset, setDataset } from '$lib/context/dataset.svelte.js'
	import { debug } from '$lib/globals/dev.svelte.js'
	import Tags from '$lib/ui/dataset/tags.svelte'
	import { onMount } from 'svelte'
	import { handleEnhance } from '$lib/utils/forms/index.js'
	const labels = {
		source: 'Source',
		content: 'Content',
		file_id: 'File ID',
		constraints: 'Constraints',
		crs: 'CRS',
		spatial_coverage: 'Spatial coverage',
		spatial_resolution: 'Spatial resolution',
		temporal_coverage: 'Temporal coverage',
		temporal_resolution: 'Temporal resolution',
		size: 'Size',
		lineage: 'Lineage',
		data_source: 'Data source',
		data_quality: 'Data quality'
	}
	let { data } = $props()
	setDataset(data.dataset)
	const ctx = getDataset()
	let editor_enabled = $state(false)
	onMount(() => {
		debug.data = data
	})
	$effect(() => {
		editor_enabled = false
		ctx.dataset = data.dataset
		setTimeout(() => {
			editor_enabled = true
		}, 1)
	})
</script>

{#if ctx.dataset && !Array.isArray(ctx.dataset)}
	<BaseSection>
		<div class="page">
			<div class="left-col">
				<div class="form">
					<Subtitle size="lg">Dataset information</Subtitle>
					<form action="?/update" method="POST" use:enhance={handleEnhance()}>
						<input type="hidden" value={JSON.stringify(ctx.dataset)} name="dataset" />
						<div class="fields">
							<InputBlock>
								<Input label="Title" required>
									<Text name="title" bind:value={ctx.dataset.title} required></Text>
								</Input>
								<Input label="Description">
									<textarea name="notes" hidden bind:value={ctx.dataset.notes}></textarea>
									{#if editor_enabled}
										<Editor bind:content={ctx.dataset.notes}></Editor>
									{/if}
									<!-- <Textarea name="notes" bind:value={ctx.dataset.notes}></Textarea> -->
								</Input>
							</InputBlock>

							<InputBlock design="row">
								<Input label="Author">
									<Text name="author" bind:value={ctx.dataset.author}></Text>
								</Input>
								<Input label="Author email">
									<Text name="author_email" type="email" bind:value={ctx.dataset.author_email}
									></Text>
								</Input>
							</InputBlock>
							<InputBlock design="row">
								<Input label="Maintainer">
									<Text name="maintainer" bind:value={ctx.dataset.maintainer}></Text>
								</Input>
								<Input label="Maintainer email">
									<Text
										name="maintainer_email"
										type="email"
										bind:value={ctx.dataset.maintainer_email}
									></Text>
								</Input>
							</InputBlock>
							<InputBlock design="row">
								<Input label="License">
									<Select
										name="license_id"
										bind:value={ctx.dataset.license_id}
										options={licenses.map((license) => ({
											label: license.title,
											value: license.id
										}))}
									></Select>
								</Input>

								<Input label="Version">
									<Text name="version" bind:value={ctx.dataset.version}></Text>
								</Input>
							</InputBlock>
							<Subtitle>Metadata</Subtitle>
							{#each ctx.dataset.extras as extra (extra)}
								<Input label={labels[extra.key]}>
									<Text name={extra.key} bind:value={extra.value}></Text>
								</Input>
							{/each}
						</div>
						<div class="buttons">
							<Button
								style="alt"
								type="button"
								onclick={() => {
									invalidateAll()
								}}>Cancel</Button
							>
							<Button style="alt">Save</Button>
						</div>
					</form>
				</div>
			</div>
			<div class="right-col">
				<div class="form">
					<Tags existing_tags={data.tags}></Tags>
				</div>
			</div>
		</div>
	</BaseSection>
{/if}

<style>
	.page {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-auto-flow: row;
		gap: 2rem;
	}
	.form {
		background-color: var(--background-muted);
		padding: 2rem;
		border-radius: var(--radius);
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	form {
		display: grid;
		grid-auto-flow: row;
		gap: 1rem;
	}
	.fields {
		display: grid;
		grid-auto-flow: row;
		gap: 1rem;
	}
	.left-col {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.right-col {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.buttons {
		display: flex;
		justify-content: space-between;
	}
	@media (min-width: 1024px) {
		.page {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			grid-template-rows: minmax(0, 1fr);
		}
	}
</style>
