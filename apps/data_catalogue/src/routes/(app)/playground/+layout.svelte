<script lang="ts">
	import { page } from '$app/state'
	import { Button, Icon } from '@imago/ui'
	let { children } = $props()
</script>

<div class="page">
	<nav>
		<Button active={page.url.pathname === '/playground/requests'} href="/playground/requests"
			>Requests</Button
		>

		<Button active={page.url.pathname === '/playground'} href="/playground">
			<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
		</Button>
	</nav>
	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	nav {
		width: min(100lvw - 4rem, 1440px);
		margin-inline: auto;
		display: flex;
		justify-content: flex-end;
		padding: 1rem 2rem;
		gap: 1rem;
	}
</style>
