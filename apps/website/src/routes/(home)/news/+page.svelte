<script lang="ts">
	import NewsCard from '$lib/ui/cards/news_card.svelte'
	import { Subtitle, Title } from '@imago/ui'
	let { data } = $props()
</script>

<div class="news-section">
	<div class="title">
		<Title size="lg" text="News"></Title>
	</div>
	<div class="cards">
		{#each data.articles as article}
			<NewsCard {article}></NewsCard>
		{/each}
		{#if data.articles.length === 0}
			<Title text="This section is currently empty." size="lg"></Title>
			<Subtitle text="Apologies, come back soon!"></Subtitle>
		{/if}
	</div>
</div>

<style>
	.news-section {
		width: min(100% - 2rem, 1200px);
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		gap: 4rem;
		min-height: calc(100lvh - 4rem);
		padding: 0 0 2rem 0;
	}
	.cards {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
