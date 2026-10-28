<script lang="ts">
	import { page } from '$app/state'
	import { BaseSection, Button, Title, type Routes } from '@imago/ui'

	let { children, data } = $props()
	const allowed_groups = ['settings', 'dashboard', 'new_dashboard']
</script>

<BaseSection style="extra-large">
	<div class="layout">
		<header>
			<Title>Admin settings</Title>
		</header>
		<nav>
			<!-- {#each routes.filter((route) => route.href === page.url.pathname) as { href, label }} -->
			<!-- 	<Button style="nav" active={page.url.pathname.startsWith(href)} line_clamp {href} -->
			<!-- 		>{label}</Button -->
			<!-- 	> -->
			<!-- {/each} -->
			{#each data.routes.filter( (x) => allowed_groups.includes(x.label.toLowerCase()) ) as { label, href, subpaths }}
				<Button style="nav" active={page.url.pathname.startsWith(href)} line_clamp {href}
					>{label}</Button
				>
				{#if page.url.pathname.startsWith(href)}
					{#if subpaths && subpaths.length > 0}
						<div class="subpaths">
							{#each subpaths as { label, href }}
								<Button style="nav" active={page.url.pathname.startsWith(href)} line_clamp {href}
									>{label}</Button
								>
							{/each}
						</div>
					{/if}
				{/if}
			{/each}
			<!-- {#each settings_routes as { label, href, subpaths }} -->
			<!-- 	<Button style="nav" active={page.url.pathname.startsWith(href)} line_clamp {href} -->
			<!-- 		>{label}</Button -->
			<!-- 	> -->
			<!-- 	{#if page.url.pathname.startsWith(href)} -->
			<!-- 		{#if subpaths && subpaths.length > 0} -->
			<!-- 			<div class="subpaths"> -->
			<!-- 				{#each subpaths as { label, href }} -->
			<!-- 					<Button style="nav" active={page.url.pathname.startsWith(href)} line_clamp {href} -->
			<!-- 						>{label}</Button -->
			<!-- 					> -->
			<!-- 				{/each} -->
			<!-- 			</div> -->
			<!-- 		{/if} -->
			<!-- 	{/if} -->
			<!-- {/each} -->
		</nav>
		<div class="content">
			{@render children()}
		</div>
	</div>
</BaseSection>

<style>
	.layout {
		display: grid;
		grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
		grid-template-rows: minmax(0, max-content) minmax(0, 1fr);
		gap: 2rem;
	}
	.content {
		overflow: hidden;
	}
	header {
		grid-row: 1 / 2;
		grid-column: 1 / -1;
	}
	nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.subpaths {
		padding-left: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
