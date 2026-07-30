<script lang="ts">
	import { debug } from '$lib/globals/dev.svelte'
	import Debug from '$lib/ui/cards/debug.svelte'
	import Logos from '$lib/ui/cards/logos.svelte'
	import { Button, DynamicNav } from '@imago/ui'
	let { children, data } = $props()
</script>

<DynamicNav routes={data.routes} nav_height="4rem">
	{#snippet logos({ scroll })}
		<Logos {scroll}></Logos>
	{/snippet}
</DynamicNav>
{@render children?.()}
{#if data.allow_debug}
	<div class="tooltip">
		<Button
			active={debug.status}
			onclick={() => {
				debug.status = !debug.status
			}}>Debug</Button
		>
	</div>
	<Debug></Debug>
{/if}

<style>
	.tooltip {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
	}
</style>
