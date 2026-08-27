<script lang="ts">
	import PageSections from '$lib/ui/sections/page_sections.svelte'
	let { data } = $props()
</script>

{#each data.page_data as page}
	<PageSections sections={page.sections}></PageSections>
{/each}

<style>
</style>
