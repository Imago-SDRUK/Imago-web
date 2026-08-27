<script lang="ts">
	import CardJob from '$lib/ui/cards/card_job.svelte'
	import CardsSection from '$lib/ui/sections/cards_section.svelte'
	import { BaseSection, Title } from '@imago/ui'
	let { data } = $props()
</script>

<BaseSection>
	<CardsSection title="Careers">
		{#snippet sectionNav()}
			{#if data.careers.length === 0}
				<Title text="There are no careers available at this moment."></Title>
			{/if}
		{/snippet}
		{#each data.careers as career}
			<CardJob {career}></CardJob>
		{/each}
	</CardsSection>
</BaseSection>

<style>
</style>
