<script lang="ts">
	import type { Snippet } from 'svelte'
	import { slide } from 'svelte/transition'
	let {
		children,
		trigger
	}: {
		children?: Snippet
		trigger: Snippet<[{ toggleMenu: (value?: boolean) => void; open: boolean }]>
	} = $props()
	let open = $state(false)
	let menu_button_ref: HTMLDivElement | null = $state(null)
	let location: DOMRect | undefined = $state()
	const toggleMenu = (value?: boolean) => {
		location = menu_button_ref?.getBoundingClientRect()
		if (value !== undefined) {
			open = value
			return
		}
		open = !open
	}
	let window_width = $state(0)
	let menu_element_width = $state(0)
	const getLeftPosition = (left: number) => {
		if (left + menu_element_width > window_width) {
			return window_width - menu_element_width - 32
		}
		return left
	}
</script>

<svelte:window bind:innerWidth={window_width} />
{#if open && children}
	<button
		aria-labelledby={menu_button_ref?.id}
		onclick={() => {
			toggleMenu(false)
		}}
		class="overlay"
	></button>
{/if}
<div
	role="none"
	class="menu-wrapper"
	onpointerenter={() => toggleMenu(true)}
	onpointerleave={() => toggleMenu(false)}
>
	<div class="menu-button" bind:this={menu_button_ref}>
		{@render trigger({ toggleMenu, open })}
	</div>
	{#if open && children}
		<menu
			bind:clientWidth={menu_element_width}
			transition:slide
			class:with-children={true}
			style:--left="{getLeftPosition(location?.left ?? 0)}px"
			style:--top="{location?.bottom ?? 0}px"
		>
			{@render children()}
		</menu>
	{/if}
</div>

<style>
	.menu-button {
		position: relative;
	}
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100lvw;
		height: 100lvh;
	}
	.with-children {
		position: fixed;
		left: var(--left);
		top: var(--top);
		background-color: var(--background);
		padding: 0.75rem 1rem;
		border: 1px solid var(--highlight);
		border-radius: 0.35rem;
	}
</style>
