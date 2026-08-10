<script lang="ts">
	import PageSections from '$lib/ui/sections/page_sections.svelte'
	import { jstr } from '@arturoguzman/art-ui'

	let { data } = $props()
</script>

{#each data.page_data as page}
	<PageSections sections={page.sections}></PageSections>
{/each}

<!-- <pre>{jstr(data)}</pre> -->

<style>
</style>
