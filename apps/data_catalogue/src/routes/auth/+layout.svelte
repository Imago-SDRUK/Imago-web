<script lang="ts">
	import { ROUTES } from '$lib/globals/routes.js'
	import Logos from '$lib/ui/cards/logos.svelte'
	import { DynamicNav } from '@imago/ui'
	let { children } = $props()
</script>

<DynamicNav routes={ROUTES} nav_height="4rem">
	{#snippet logos({ scroll })}
		<Logos {scroll}></Logos>
	{/snippet}
</DynamicNav>
{@render children?.()}
