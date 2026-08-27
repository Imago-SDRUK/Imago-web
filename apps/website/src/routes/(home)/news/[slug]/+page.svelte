<script lang="ts">
	import NewsletterCard from '$lib/ui/cards/newsletter_card.svelte'
	import Carousel from '$lib/ui/components/carousel.svelte'
	import { getArticleSections } from '$lib/utils/directus/articles.js'
	import { DateTime } from 'luxon'
	import { Subtitle, Title, Fact, Paragraph } from '@imago/ui'
	let { data } = $props()
</script>

<div class="page">
	{#each data.article as article}
		{@const sections = getArticleSections(article)}
		<div class="article">
			<div class="header">
				<div class="left-col">
					<Title size="xl" text={article.title}></Title>
				</div>
				<div class="right-col">
					{#if article.user_created && typeof article.user_created !== 'string' && article.user_created.first_name}
						<Fact text="By {article.user_created.first_name} {article.user_created.last_name ?? ''}"
						></Fact>
					{/if}
					{#if article.date_updated}
						<Fact
							text={`Updated on ${DateTime.fromISO(article.date_updated).toLocaleString(DateTime.DATE_MED)}`}
						></Fact>
					{/if}
					{#if article.date_created}
						<Fact
							text={`Posted on ${DateTime.fromISO(article.date_created).toLocaleString(DateTime.DATE_MED)}`}
						></Fact>
					{/if}
				</div>
			</div>
			{#if article.media}
				<Carousel media={article.media}></Carousel>
			{/if}
			{#each sections as section}
				{#if typeof section !== 'string'}
					<div class="section">
						<div class="section-header">
							{#if section.title}
								<Subtitle text={section.title}></Subtitle>
							{/if}
							{#if section.subtitle}
								<Subtitle text={section.subtitle}></Subtitle>
							{/if}
						</div>
						<div class="section-blocks">
							{#each section.content as block}
								<div class="block" data-size={block.size}>
									{#if block.type === 'text'}
										{#if block.content}
											<div class="content prose">
												<Paragraph>{@html block.content}</Paragraph>
											</div>
										{/if}
									{/if}
									{#if block.type === 'image'}
										{#if block.media}
											<Carousel enable_description media={block.media}></Carousel>
										{/if}
									{/if}
									{#if block.type === 'cta'}
										{#if block.action === 'newsletter'}
											<NewsletterCard></NewsletterCard>
										{/if}
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.page {
		color: var(--theme-colour-text);
		padding-top: 4rem;
	}
	.article {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: min(100% - 2rem, 1280px);
		margin-inline: auto;
	}
	/* .tags { */
	/* 	display: flex; */
	/* 	gap: 0.5rem; */
	/* } */
	.header {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, max-content);
		gap: 1rem;
	}
	.left-col {
		border-right: 1px solid var(--theme-colour-highlight);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding-right: 1rem;
	}
	.right-col {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-bottom: 1px solid
			color-mix(in oklab, var(--theme-colour-text) 30%, var(--theme-colour-background) 70%);
		padding-bottom: 4rem;
		margin-bottom: 4rem;
	}
	.section:last-of-type {
		border-bottom: none;
	}
	.section-blocks {
		padding-left: 3rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.block[data-size='small'] {
		width: min(100% - 2rem, 400px);
	}
	.block[data-size='medium'] {
		width: min(100% - 2rem, 800px);
	}
	.content {
		width: min(100% - 2rem, 600px);
	}
</style>
