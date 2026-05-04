<script lang="ts">
	import { resolve } from '$app/paths'
	import { page } from '$app/state'
	import { Button, Icon } from '@imago/ui'

	let { children } = $props()
	const basePath = (id?: string) => `/datasets/${id}`
</script>

<div class="metadata-editor-section">
	<nav class="nav">
		<Button
			href={resolve('/(app)/datasets/[...id]/edit', { id: page.params.id })}
			style="square"
			active={page.url.pathname === `${basePath(page.params.id)}/edit`}
		>
			<Icon icon={{ icon: 'table', set: 'tabler' }}></Icon>
		</Button>
		<Button
			style="square"
			active={page.url.pathname === `${basePath(page.params.id)}/edit/resources`}
			href={resolve('/(app)/datasets/[...id]/edit/resources', { id: page.params.id })}
		>
			<Icon icon={{ icon: 'file-download', set: 'tabler' }}></Icon>
		</Button>
	</nav>
	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.metadata-editor-section {
		display: grid;
		grid-template-columns: minmax(0, 5rem) minmax(0, 1fr);
	}
	.nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0 1rem;
	}
</style>
