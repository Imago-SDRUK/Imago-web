<script lang="ts">
	import { ROUTES } from '$lib/globals/routes'
	import { NAV_HEIGHT } from '$lib/globals/style'
	import { notify } from '$lib/stores/notify'
	import Logos from '$lib/ui/cards/logos.svelte'
	import { observeRoot } from '$lib/utils/observer.svelte'
	import { Notification, DynamicNav, Footer, Button } from '@imago/ui'
	let { children } = $props()
</script>

<div class="screen" use:observeRoot></div>
<DynamicNav routes={ROUTES} nav_height={NAV_HEIGHT}>
	{#snippet logos({ scroll })}
		<Logos {scroll}></Logos>
	{/snippet}
	<Button href="/#newsletter-form">Join the newsletter</Button>
</DynamicNav>
<main id="main">
	{@render children()}
</main>
<Footer></Footer>
<Notification {notify}></Notification>

<style>
</style>
