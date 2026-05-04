<script lang="ts">
	import { page } from '$app/state'
	import Notes from '$lib/ui/text/notes.svelte'
	import { Button, Icon, Paragraph, Subtitle } from '@imago/ui'
	import ProductTitle from './product_title.svelte'
	import { getDataset } from '$lib/context/dataset.svelte'
	import { METADATA_LABELS } from '$lib/globals/datasets'
	let ctx = getDataset()
	const file_format_icons = [
		'file-download',
		'file-type-jpg',
		'file-type-pdf',
		'file-type-png',
		'file-type-sql',
		'file-type-svg',
		'file-type-xml',
		'file-type-zip',
		'file-type-csv',
		'file-type-doc',
		'file-type-docx',
		'file-type-html'
	]
	const getFileFormatIcon = (format?: string) => {
		if (!format) {
			return {
				icon: file_format_icons[0],
				set: 'tabler'
			}
		}
		return {
			icon:
				file_format_icons.find((icons) => icons.includes(format.toLowerCase())) ??
				file_format_icons[0],
			set: 'tabler'
		}
	}
</script>

<div class="product">
	<div class="header">
		<ProductTitle state={ctx.dataset.state} title={ctx.dataset.title}></ProductTitle>
		{#if 'notes' in ctx.dataset && ctx.dataset.notes !== null && ctx.dataset.notes !== ''}
			<div class="product-notes">
				<Notes note={String(ctx.dataset.notes)}></Notes>
			</div>
		{/if}
	</div>
	{#if 'resources' in ctx.dataset && Array.isArray(ctx.dataset.resources) && ctx.dataset.resources.length > 0}
		<div class="product-content">
			<div class="resources">
				<Subtitle size="md" text="Resources"></Subtitle>
				<div class="content">
					<div class="pills">
						{#each ctx.dataset.resources as resource}
							<div class="pill">
								<Subtitle size="xs">{resource.name ?? resource.description}</Subtitle>
								<div class="pill-buttons">
									<Button
										umami_event="File details"
										href="/datasets/{page.params.id}/resources/{resource.id}"
										>{#snippet leftCol()}
											<span>Details</span>
										{/snippet}
										{#snippet rightCol()}
											<Icon icon={{ icon: 'arrow-narrow-right', set: 'tabler' }}></Icon>
										{/snippet}
									</Button>
									{#if resource.format.toLowerCase() === 'html'}
										<Button umami_event="Visit external link" href={resource.url}
											>{#snippet leftCol()}
												<span>Visit</span>
											{/snippet}
											{#snippet rightCol()}
												<Icon icon={{ icon: 'arrow-up-right-01', set: 'hugeicons' }}></Icon>
											{/snippet}
										</Button>
										<!-- {:else} -->
										<!-- 	<Button -->
										<!-- 		umami_event="Download resource" -->
										<!-- 		href={resource.url} -->
										<!-- 		download={resource.name} -->
										<!-- 		>{#snippet leftCol()} -->
										<!-- 			<span>Download</span> -->
										<!-- 		{/snippet} -->
										<!-- 		{#snippet rightCol()} -->
										<!-- 			<Icon icon={getFileFormatIcon(resource.format)}></Icon> -->
										<!-- 		{/snippet} -->
										<!-- 	</Button> -->
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
	{#if 'extras' in ctx.dataset && Array.isArray(ctx.dataset.extras) && ctx.dataset.extras.filter((extra) => extra.value !== '' && extra.value !== null && extra.value !== undefined).length > 0}
		<div class="product-content">
			<div class="resources">
				<Subtitle size="md" text="Metadata"></Subtitle>
				<div class="content">
					<div class="pills">
						{#each ctx.dataset.extras.filter((extra) => extra.value !== '' && extra.value !== null && extra.value !== undefined) as extra}
							<div class="pill">
								<Paragraph>{METADATA_LABELS[extra.key] ?? extra.key}</Paragraph>
								<Paragraph>{extra.value}</Paragraph>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.header {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.product {
		display: flex;
		flex-direction: column;
		gap: 3rem;
		border-radius: 0.35rem;
	}
	.product-notes {
		background-color: var(--background-muted);
		padding: 2rem;
		border-radius: var(--radius);
	}
	.product-content {
		padding: 2rem;
		background-color: var(--background-muted);
	}

	.resources {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	/* .resources .content { */
	/* 	padding: 1rem; */
	/* } */
	.pills {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.pill {
		background-color: var(--background);
		display: grid;
		/* justify-items: center; */
		align-items: start;
		width: 100%;
		grid-template-columns: minmax(min-content, 1fr) minmax(0, 4fr);
		gap: 1rem;
		padding: 1rem;
		border-radius: 0.5rem;
	}
	.pill-buttons {
		display: flex;
		width: 100%;
		justify-content: flex-end;
		align-items: center;
		gap: 1rem;
		overflow: hidden;
	}
</style>
