<script lang="ts">
	import { enhance } from '$app/forms'
	import { invalidateAll } from '$app/navigation'
	import { getDataset } from '$lib/context/dataset.svelte'
	import { APP_STATE } from '$lib/globals/state.svelte'
	import { notify } from '$lib/stores/notify'
	import type { CkanTag } from '$lib/types/ckan'
	import { sleep } from '$lib/utils'
	import { fuzzy, getId, jstr } from '@arturoguzman/art-ui'
	import { Subtitle, Button, Paragraph, Input, Text, Icon } from '@imago/ui'
	const ctx = getDataset()
	let { existing_tags }: { existing_tags: CkanTag[] } = $props()
	let tags: { display_name: string; id: string }[] = $state([])
	let search = $state('')
	let search_results = $derived(
		existing_tags
			.filter(() => search !== '')
			.filter((tag) => !ctx.dataset.tags.find((_tag) => tag.id === _tag.id))
			.filter((tag) => fuzzy(search, tag.display_name))
	)
</script>

<div class="field-header">
	<Subtitle size="lg">Tags</Subtitle>
	<div class="wrapper"></div>
</div>
<form
	action="?/add_tag"
	method="POST"
	use:enhance={({ cancel }) => {
		if (APP_STATE.loading) {
			cancel()
		}
		APP_STATE.loading = true
		return async ({ result }) => {
			APP_STATE.loading = false
			if ('data' in result) {
				notify.send(String(result.data?.message))
			}
			search = ''
			invalidateAll()
		}
	}}
>
	<div class="fields">
		<div class="search">
			<Input label="Search or add a tag">
				<Text
					onkeydown={(e) => {
						if (e.key === ',') {
							e.preventDefault()
						}
					}}
					bind:value={search}
				></Text>
			</Input>

			{#if search !== ''}
				<div class="search-results">
					{#each search_results as tag, index (tag)}
						<input type="hidden" name="tag" value={tag.name} />
						<div class="tag">
							<Button>
								<Paragraph>{tag.display_name}</Paragraph>
							</Button>
						</div>
					{/each}
					{#if search_results.length === 0}
						<input type="hidden" name="tag" value={search} />
						<Button>
							<Icon icon={{ icon: 'plus', set: 'tabler', size: 'lg' }}></Icon>
							<Paragraph>{search}</Paragraph>
						</Button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</form>

<div class="tags">
	{#each ctx.dataset.tags as tag (tag)}
		<form
			action="?/remove_tag"
			method="POST"
			use:enhance={({ cancel }) => {
				if (APP_STATE.loading) {
					cancel()
				}
				APP_STATE.loading = true
				return async ({ result }) => {
					APP_STATE.loading = false
					if ('data' in result) {
						notify.send(String(result.data?.message))
					}
					search = ''
					invalidateAll()
				}
			}}
		>
			<div class="tag">
				<input type="hidden" hidden value={tag.display_name} name="tag" />
				<Button hover_label={`Click to delete ${tag.display_name}`} style="tag">
					<Paragraph>{tag.display_name}</Paragraph>
				</Button>
			</div>
		</form>
	{/each}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.field-header {
		display: flex;
		justify-content: space-between;
	}
	.tag {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.search-results {
		padding: 1rem;
		display: flex;
		gap: 0.5rem;
		background-color: var(--background);
		border-radius: 0 0 var(--radius) var(--radius);
		flex-wrap: wrap;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.buttons {
		display: flex;
		justify-content: space-between;
	}
</style>
