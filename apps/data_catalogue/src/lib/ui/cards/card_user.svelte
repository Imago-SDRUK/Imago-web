<script lang="ts">
	import { BaseCard, Paragraph, Button, Icon, Subtitle } from '@imago/ui'
	import { toggleDialog } from '$lib/utils/ui'
	import type { Snippet } from 'svelte'

	let {
		user,
		children
	}: {
		user: { first_name: string; last_name: string; email: string; id: string }
		children?: Snippet
	} = $props()
	let edit = $state(false)
</script>

<BaseCard overflow border rounded>
	<div class="user-card">
		<div class="section">
			<div class="section-title">
				<Paragraph>
					<Icon icon={{ icon: 'user', set: 'tabler' }}></Icon>
					{user.first_name}
					{user.last_name}</Paragraph
				>
				<div class="buttons">
					{@render children?.()}
				</div>
				<!-- <div class="buttons"> -->
				<!-- 	<Button -->
				<!-- 		active={edit} -->
				<!-- 		onclick={() => { -->
				<!-- 			edit = !edit -->
				<!-- 		}} -->
				<!-- 	> -->
				<!-- 		<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon> -->
				<!-- 	</Button> -->
				<!-- 	{#if edit} -->
				<!-- 		<Button -->
				<!-- 			onclick={() => { -->
				<!-- 				toggleDialog(`delete-user-${user.id}`) -->
				<!-- 			}} -->
				<!-- 		> -->
				<!-- 			<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon> -->
				<!-- 		</Button> -->
				<!-- 	{/if} -->
				<!-- </div> -->
			</div>
			<div class="user-information">
				<Paragraph size="xs">Email: {user.email}</Paragraph>
				<Paragraph size="xs">ID: {user.id}</Paragraph>
			</div>
		</div>
	</div></BaseCard
>

<style>
	.user-card {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.section {
		display: grid;
		grid-template-rows: minmax(0, 1fr) minmax(0, max-content);
		gap: 0.25rem;
	}
	.section-title {
		display: flex;
		justify-content: space-between;
	}
	.user-information {
		display: flex;
		flex-direction: column;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}
</style>
