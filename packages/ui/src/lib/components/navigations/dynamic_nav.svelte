<script lang="ts">
	import { page } from '$app/state'
	import { Button, Icon } from '@imago/ui'
	import Menu from '../menus/floating_menu.svelte'
	import type { Routes } from './types'
	import type { Snippet } from 'svelte'
	import { resolve } from '$app/paths'
	let {
		routes,
		nav_height,
		logos,
		children
	}: {
		routes: Routes
		nav_height: string
		logos?: Snippet<[{ scroll: number }]>
		children?: Snippet<[{ scroll: number }]>
	} = $props()
	let window_height = $state(0)
	let window_width = $state(0)
	let scroll = $state(0)
	let desktop = $derived(window_width > 768)
	let menu_open = $state(false)
	let mobile_menu_selection = $derived.by(() => {
		const value = $state(routes[0].href ?? '')
		return value
	})
	const getBgPercentage = (scroll: number, height: number) => {
		const result = (scroll * 100) / height
		if (result > 100) return 100
		return result
	}
</script>

<svelte:window
	bind:innerWidth={window_width}
	bind:innerHeight={window_height}
	bind:scrollY={scroll}
	onscroll={() => {
		menu_open = false
	}}
/>
<nav
	class:compact-nav={scroll > 256 && desktop}
	style:--nav-height={nav_height}
	style:--bg-percentage="{getBgPercentage(scroll, window_height)}%"
>
	<div class="left-col">
		{#if page.url.pathname !== '/'}
			<button
				aria-label="back page"
				class="button-link"
				onclick={() => {
					history.back()
				}}
			>
				<Icon icon={{ icon: 'arrow-narrow-left', set: 'tabler', size: 'lg' }}></Icon>
			</button>
		{/if}
		{#if desktop}
			{#if page.url.pathname === '/' && logos}
				{@render logos({ scroll })}
			{/if}
			{#if page.url.pathname !== '/'}
				<a href={resolve('/', {})} aria-label="home">
					<img class="icon" src="/favicon.png" alt="" />
				</a>
			{/if}
		{/if}
		{#if !desktop}
			<a href="/" aria-label="home">
				<img class="icon" src="/favicon.png" alt="" />
			</a>
		{/if}
	</div>
	<div class="right-col">
		{#if !desktop}
			<button
				aria-label="menu toggle"
				onclick={() => {
					menu_open = !menu_open
				}}
			>
				<Icon icon={{ icon: 'menu', set: 'tabler', size: 'lg' }}></Icon>
			</button>
		{/if}
		<div class="routes" data-menu={menu_open ? true : undefined}>
			{#if desktop}
				{#each routes as { href, label, subpaths }}
					{#if subpaths.length > 0}
						<Menu>
							{#snippet trigger({ toggleMenu })}
								{#if desktop && href}
									<Button
										active={page.url.pathname.startsWith(href) && href !== '/'}
										style="anchor"
										onpointerdown={() => toggleMenu(false)}
										{href}>{label}</Button
									>
								{/if}
							{/snippet}
							<div class="subpaths">
								{#each subpaths as { href, label, target }}
									<Button style="anchor" {href} {target}>{label}</Button>
								{/each}
							</div>
						</Menu>
					{:else}
						<Menu>
							{#snippet trigger({ toggleMenu })}
								{#if desktop && href}
									<Button
										active={page.url.pathname.startsWith(href) && href !== '/'}
										style="anchor"
										onpointerdown={() => toggleMenu(false)}
										{href}>{label}</Button
									>
								{/if}
							{/snippet}
						</Menu>
					{/if}
				{/each}
			{:else}
				<div class="mobile-menu">
					<div class="mobile-menu-tabs">
						{#each routes as { href, label }}
							{#if href === mobile_menu_selection}
								<Button
									style="anchor"
									onclick={() => {
										menu_open = false
									}}
									{href}>{label}</Button
								>
							{:else}
								<Button
									style="anchor"
									onclick={() => {
										if (href) {
											mobile_menu_selection = href
										}
									}}><p>{label}</p></Button
								>
							{/if}
						{/each}
					</div>
					<div class="mobile-menu-routes">
						{#each routes.filter((route) => route.href === mobile_menu_selection) as { subpaths }}
							{#each subpaths as { href, label }}
								<Button
									style="anchor"
									onclick={() => {
										menu_open = false
									}}
									{href}><p>{label}</p></Button
								>
							{/each}
						{/each}
					</div>
				</div>
			{/if}
		</div>
		{@render children?.({ scroll })}
	</div>
</nav>

<style>
	nav {
		background: color-mix(in oklab, white 0%, var(--background) var(--bg-percentage));
		color: var(--theme-colour-highlight);
		border: 1px solid transparent;
		width: 100%;
		height: var(--nav-height);
		position: sticky;
		top: 0rem;
		left: 0rem;
		padding: 1rem;
		display: grid;
		margin-inline: auto;
		grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
		transition: all 0.3s ease-in-out;
		/* background-color: var(--theme-colour-background); */
		z-index: 99;
	}
	.compact-nav {
		top: 1rem;
		background-color: var(--background);
		width: min(100% - 2rem, 600px);
		margin-inline: auto;
		border: 1px solid var(--highlight);
	}
	.button-link {
		transition: all 0.3s ease-in-out;
		color: var(--text);
	}
	.button-link:target {
		background-color: red;
	}
	.left-col {
		display: flex;
		gap: 2rem;
	}
	.right-col {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		align-items: center;
	}
	.routes {
		position: fixed;
		top: 0;
		right: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: flex-end;
		align-items: center;
		transform: translate(200%, 4rem);
		border: 1px solid var(--highlight);
		border-radius: 0.35rem;
		background-color: var(--background);
		transition: all 0.3s ease-in-out;
		padding: 2rem;
		width: calc(100% - 2rem);
	}
	.routes[data-menu] {
		z-index: 2;
		transform: translate(0%, 4rem);
		/* width: calc(100% - 2rem); */
	}
	.icon {
		height: 2rem;
	}
	.subpaths {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mobile-menu {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, max-content) minmax(0, 1fr);
		width: 100%;
		gap: 1rem;
	}
	.mobile-menu-tabs {
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid var(--secondary);
	}
	.mobile-menu-routes {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	@media (min-width: 768px) {
		nav {
			border-radius: 999px;
			background-color: initial;
		}
		.routes {
			position: initial;
			top: initial;
			right: initial;
			border: none;
			background-color: initial;
			transform: initial;
			display: flex;
			flex-direction: initial;
			padding: 0;
			gap: 1rem;
			justify-content: flex-end;
			align-items: center;
			width: initial;
		}
		.routes[data-menu] {
			transform: translate(0, 0);
		}
	}
	@media print {
		nav {
			display: none;
		}
	}
</style>
