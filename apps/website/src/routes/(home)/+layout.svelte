<script lang="ts">
	import { ROUTES } from '$lib/globals/routes'
	import { NAV_HEIGHT } from '$lib/globals/style'
	import { notify } from '$lib/stores/notify'
	import Logos from '$lib/ui/cards/logos.svelte'
	import { Icon } from '@imago/ui'
	import { observeRoot } from '$lib/utils/observer.svelte'
	import { Notification, DynamicNav, Footer, Button } from '@imago/ui'
	import { onMount } from 'svelte'
	import { getId } from '@arturoguzman/art-ui'
	let { data, children } = $props()
	let footer_height = $state(0)
	const footer_id = `footer-${getId()}`
	onMount(() => {
		const el = document.getElementById(footer_id)
		if (el) {
			footer_height = el.clientHeight
		}
	})
</script>

<div class="screen" use:observeRoot></div>
<DynamicNav routes={ROUTES} nav_height={NAV_HEIGHT}>
	{#snippet logos({ scroll })}
		<Logos {scroll}></Logos>
	{/snippet}
	<Button href="/#newsletter-form"><Icon icon={{ icon: 'mail', set: 'tabler', size: 'lg' }}></Icon>Join the newsletter</Button>
</DynamicNav>
<main style:--footer-height={`${footer_height}px`}>
	{@render children?.()}
</main>

<Footer id={footer_id} routes={data.footer_pages}></Footer>
<Notification {notify}></Notification>

<style>
	main {
		min-height: calc(100lvh - var(--footer-height));
		/* overflow-x: hidden; */
		position: relative;
	}
</style>
