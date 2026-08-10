<script lang="ts">
	import type { Section } from '$lib/types/directus'
	import { Paragraph, Subtitle, Title } from '@imago/ui'
	import PageBlock from '../cards/page_block.svelte'

	import { BaseSection } from '@imago/ui'
	let { section }: { section: Section } = $props()

	function getBasis(num?: number) {
		if (num === 1) return '100%'
		if (num === 2) return '45%'
		return
	}
</script>

<BaseSection>
	<div class="section">
		<div class="header">
			{#if section.title}
				<Title size="lg" text={section.title}></Title>
			{/if}
			{#if section.subtitle}
				<Subtitle size="sm" text={section.subtitle}></Subtitle>
			{/if}
			{#if section.description}
				<Paragraph style="full-width">
					{@html section.description}
				</Paragraph>
			{/if}
		</div>
		<div class="blocks">
			{#each section.content ?? [] as { blocks_id }}
				<div class="block-wrapper" style:--basis={getBasis(section.content?.length)}>
					<PageBlock {blocks_id}></PageBlock>
				</div>
			{/each}
		</div>
	</div>
</BaseSection>

<style>
	.section {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, max-content) minmax(0, 1fr);
		width: min(100% - 4rem, 1280px);
		gap: clamp(1rem, 0.667rem + 1.667vw, 2rem);
	}
	.header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}
	.blocks {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.block-wrapper {
		flex-basis: var(--basis, 45%);
		justify-content: space-evenly;
		container-type: inline-size;
	}
	@media (min-width: 768px) {
		.block-wrapper {
			flex-basis: var(--basis, 30%);
		}
	}
	@media (min-width: 1280px) {
		.block-wrapper {
			flex-basis: var(--basis, 24%);
		}
	}
</style>
