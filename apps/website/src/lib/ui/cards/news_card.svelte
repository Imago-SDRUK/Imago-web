<script lang="ts">
	import type { Article, ArticleSectionBlocksFile } from '$lib/types/directus'
	import { DateTime } from 'luxon'
	import { getArticleSections } from '$lib/utils/directus/articles'
	import { Picture } from '@arturoguzman/art-ui'
	import { Paragraph, BaseCard, Title, Fact, Button, Icon } from '@imago/ui'
	import Carousel from '../components/carousel.svelte'
	let { article }: { article: Article } = $props()
	const sections = $derived(getArticleSections(article))
</script>

<BaseCard rounded border shadow>
	<div class="article-card">
		<div class="left-col">
			<Carousel media={article.media}></Carousel>
			<!-- {#each article.media as media} -->
			<!-- 	{#if typeof media !== 'string' && typeof media !== 'number' && 'directus_files_id' in media} -->
			<!-- 		<div class="image"> -->
			<!-- 			<Picture image={media.directus_files_id}></Picture> -->
			<!-- 		</div> -->
			<!-- 	{/if} -->
			<!-- {/each} -->
			{#if !article.media || article.media.length === 0}
				{#if typeof sections !== 'string' && sections.length > 0}
					{@const medias = sections.reduce((acc: ArticleSectionBlocksFile[], el) => {
						const _media = el.content.reduce((_acc: ArticleSectionBlocksFile[], el) => {
							if (el.media && el.media.length > 0 && _acc.length === 0) {
								_acc.push(el.media[0])
							}
							return _acc
						}, [])
						_media.forEach((el) => acc.push(el))
						return acc
					}, [])}
					{#each medias as media}
						{#if typeof media !== 'string' && typeof media !== 'number' && 'directus_files_id' in media}
							<div class="image">
								<Picture fit="contain" image={media.directus_files_id}></Picture>
							</div>
						{/if}
					{/each}
				{/if}
			{/if}
		</div>
		<div class="right-col">
			<div class="title">
				<Title size="lg" text={article.title}></Title>
				<!-- <div class="tags"> -->
				<!-- 	<Button alt -->
				<!-- 		>{#snippet leftCol()} -->
				<!-- 			<p>Tag</p> -->
				<!-- 		{/snippet}</Button -->
				<!-- 	> -->
				<!-- 	<Button alt -->
				<!-- 		>{#snippet leftCol()} -->
				<!-- 			<p>Tag</p> -->
				<!-- 		{/snippet}</Button -->
				<!-- 	> -->
				<!-- 	<Button alt -->
				<!-- 		>{#snippet leftCol()} -->
				<!-- 			<p>Tag</p> -->
				<!-- 		{/snippet}</Button -->
				<!-- 	> -->
				<!-- </div> -->
			</div>

			{#if article.description}
				<div class="content">
					<Paragraph>{@html article.description}</Paragraph>
				</div>
			{/if}
			<div class="footer">
				{#if article.user_created && typeof article.user_created !== 'string' && article.user_created.first_name}
					<Fact text="By {article.user_created.first_name} {article.user_created.last_name ?? ''}"
					></Fact>
				{/if}
				{#if article.date_created}
					<Fact
						text="Posted on {DateTime.fromISO(article.date_created).toLocaleString(
							DateTime.DATE_MED
						)}"
					></Fact>
				{/if}
				<Button href="/news/{article.slug}">
					{#snippet rightCol()}
						<Icon icon={{ icon: 'arrow-narrow-right', set: 'tabler' }}></Icon>
					{/snippet}</Button
				>
			</div>
		</div>
	</div>
</BaseCard>

<style>
	.article-card {
		background: color-mix(in oklab, var(--theme-colour-background) 20%, transparent 80%);
		/* box-shadow: var(--glass); */
		color: var(--theme-colour-text);
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, 400px) minmax(0, 1fr);
		gap: 2rem;
	}
	.left-col {
		height: 100%;
	}
	.image {
		height: 100%;
	}

	.right-col {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		padding: 2rem;
		justify-content: space-between;
		/* width: 600px; */
	}
	.content {
		display: flex;
		gap: 1rem;
		align-items: flex-end;
		/* padding: 0.5rem 1rem 1rem 1rem; */
	}

	.title {
		transform: translate(0, 0);
		transition: all 0.3s ease-in-out;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* padding: 1rem; */
	}
	/* .article-card:hover .title { */
	/* 	border: 1px solid var(--theme-colour-highlight); */
	/* 	transform: translate(1rem, -1rem); */
	/* } */
	@media (min-width: 768px) {
		.article-card {
			grid-template-columns: minmax(0, 420px) minmax(0, max-content);
			grid-template-rows: initial;
		}
		.left-col {
			position: relative;
			display: flex;
			justify-content: center;
			padding: initial;
		}
		.image {
			height: 100%;
			object-fit: contain;
			position: absolute;
		}
		.right-col {
			padding: 2rem 2rem 2rem 0;
		}
	}
</style>
