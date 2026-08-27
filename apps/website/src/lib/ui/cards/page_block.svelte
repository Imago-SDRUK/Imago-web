<script lang="ts" generics="T extends Block">
	import type { Block } from '$lib/types/directus'
	import Carousel from '../components/carousel.svelte'
	import { Subtitle, Title, Paragraph, Button, Icon } from '@imago/ui'
	type Action = {
		label: string
		href?: string
		alternative?: boolean
		enable_description?: boolean
	}
	let {
		blocks_id,
		enable_description
	}: {
		blocks_id: Block | string | null | T
		enable_description?: boolean
	} = $props()
</script>

{#if blocks_id && typeof blocks_id !== 'string'}
	{@const block = blocks_id}
	{#if block.style === 'title_and_image'}
		<div class="card">
			<div class="card-title">
				{#if block.title}
					<Title size="lg" text={block.title}></Title>
				{/if}
			</div>
			<div class="card-content">
				<div class="card-image">
					{#if (block.media && block.media.length > 0) || (block.external_assets && block.external_assets.length > 0)}
						<Carousel
							{enable_description}
							external_assets={block.external_assets}
							media={block.media}
						></Carousel>
					{/if}
				</div>
			</div>
		</div>
	{/if}
	{#if block.style === 'title_only'}
		<div class="cta-card" style:--card-colour={block.background_colour}>
			<h2 class="cta-text">
				{block.title}
			</h2>
			{#if block.actions}
				<div class="icon">
					<a href={block.actions[0].href}>
						<Icon icon={{ icon: 'arrow-right-01', set: 'hugeicons', size: 'lg' }}></Icon>
					</a>
				</div>
			{/if}
		</div>
	{/if}
	{#if block.style === 'general' || block.style === 'text_media' || block.style === 'media_text'}
		{@const with_media =
			(block.media && block.media.length > 0) ||
			(block.external_assets && block.external_assets.length > 0)}
		<div class="block" data-style={block.style} style:--columns={with_media ? '2' : '1'}>
			{#if with_media}
				<div class="left-col" data-style={block.style}>
					<Carousel {enable_description} external_assets={block.external_assets} media={block.media}
					></Carousel>
				</div>
			{/if}
			<div class="right-col" data-style={block.style}>
				<div class="copy">
					<div class="header">
						{#if block.title}
							<Title text={block.title}></Title>
						{/if}
						{#if block.subtitle}
							<Subtitle text={block.subtitle}></Subtitle>
						{/if}
					</div>
					{#if block.content}
						<Paragraph>
							{@html block.content}
						</Paragraph>
					{/if}
				</div>

				{#if block.actions}
					{@const actions = block.actions as Action[]}
					{#each actions as { href, label }}
						<div class="actions" data-style={block.style}>
							<Button {href}>
								{#snippet leftCol()}
									{label}
								{/snippet}
								{#snippet rightCol()}
									{#if href?.startsWith('/')}
										<Icon icon={{ icon: 'arrow-right-01', set: 'hugeicons' }}></Icon>
									{:else}
										<Icon icon={{ icon: 'arrow-up-right-01', set: 'hugeicons' }}></Icon>
									{/if}
								{/snippet}
							</Button>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
{/if}

<style>
	.block {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.block[data-style='text_media'],
	.block[data-style='media_text'] {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: var(--columns, minmax(0, 1fr));
		gap: 2rem;
		background-color: color-mix(in oklab, var(--background-muted) 90%, var(--secondary) 10%);
		border-radius: var(--radius);
		padding: 2rem;
	}

	.left-col {
		/* grid-column: 1 /2; */
		overflow: hidden;
	}
	.right-col {
		/* grid-column: 2 /3; */
		height: 100%;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr) minmax(0, max-content);
		gap: 1rem;
	}
	.copy {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	@container (width > 600px) {
		.block {
			width: 100%;
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}
		.block[data-style='text_media'] {
			grid-template-columns: repeat(var(--columns), 1fr);
			grid-template-rows: 1fr;
		}
		.block[data-style='media_text'] {
			grid-template-columns: repeat(var(--columns), 1fr);
			grid-template-rows: 1fr;
		}
		.left-col[data-style='text_media'] {
			grid-column: 2 / 3;
			grid-row: 1 / 2;
		}
		.right-col[data-style='text_media'] {
			grid-column: 1 / 2;
			grid-row: 1 / 2;
		}
		.left-col[data-style='media_text'] {
			grid-column: 1 / 2;
			grid-row: 1 / 2;
		}
		.right-col[data-style='media_text'] {
			grid-column: 2 /3;
			grid-row: 1 / 2;
		}
	}
	.actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}
	.actions[data-style='text_media'] {
		justify-content: flex-start;
	}
	.card {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, max-content) minmax(0, 1fr);
		border: 1px solid var(--highlight);
		background-color: var(--background);
		border-radius: 0.35rem;
	}
	.card-title {
		border-bottom: 1px solid var(--highlight);
		padding: 1rem;
	}
	.card-image {
		width: 100%;
		aspect-ratio: 1 / 1;
		background-color: var(--background);
		padding: 4rem;
		/* background-color: white; */
	}
	.cta-card {
		aspect-ratio: 1 / 1;
		background: color-mix(in oklab, var(--card-colour) 20%, transparent 80%);
		border: 1px solid var(--text);
		border-radius: 0.35rem;
		color: var(--text);
		padding: 1rem;
		font-family: var(--title);
		font-weight: 700;
		font-size: clamp(2rem, 1.5rem + 2.5vw, 3.5rem);
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
		box-shadow: var(--glass);
		transition: all 0.3s ease-in-out;
	}
	.cta-card:hover {
		background: color-mix(in oklab, var(--card-colour) 40%, transparent 60%);
	}
	.icon {
		display: flex;
		justify-content: flex-end;
	}
	a {
		color: var(--text);
	}
	@media (min-width: 768px) {
		.cta-text {
			height: 100%;
			word-break: break-all;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
