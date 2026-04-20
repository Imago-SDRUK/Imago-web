<script lang="ts">
	import { DateTime } from 'luxon'
	import { debug } from '$lib/globals/dev.svelte'
	import { capitalise, jstr } from '@arturoguzman/art-ui'
	import { Accordion, BaseSection, Button, Fact, Icon, Paragraph, Subtitle } from '@imago/ui'
	import Product from '$lib/ui/products/product.svelte'
	import { getDataset, setDataset } from '$lib/context/dataset.svelte.js'
	import Stream from '$lib/ui/dataset/stream.svelte'
	let { data } = $props()
	setDataset(data.dataset)
	let ctx = getDataset()
	debug.data = data
</script>

<div class="page">
	{#if ctx.dataset}
		<BaseSection style="base">
			<div class="dataset-section">
				<div class="left-col">
					<Accordion default_open>
						{#snippet title({ open, toggleOpen })}
							<button
								class="trigger-button"
								onclick={() => {
									toggleOpen()
								}}
							>
								<Subtitle>Information</Subtitle>
								<Icon icon={{ icon: open ? 'chevron-down' : 'chevron-right', set: 'tabler' }}
								></Icon>
							</button>
						{/snippet}
						<div class="facts">
							{#if ctx.dataset.author}
								<Fact
									size="xs"
									title="Author"
									href={ctx.dataset.author_email ? `mailto:${ctx.dataset.author_email}` : null}
									text={String(ctx.dataset.author)}
								></Fact>
							{/if}
							{#if ctx.dataset.maintainer}
								<Fact
									size="xs"
									title="Maintainer"
									href={ctx.dataset.maintainer_email
										? `mailto:${ctx.dataset.maintainer_email}`
										: null}
									text={String(ctx.dataset.maintainer)}
								></Fact>
							{/if}

							{#if ctx.dataset.license_title}
								<Fact
									title="License"
									href={ctx.dataset.license_url}
									size="xs"
									text={ctx.dataset.license_title}
								></Fact>
							{/if}

							{#if ctx.dataset.version}
								<Fact title="Version" size="xs" text={ctx.dataset.version}></Fact>
							{/if}
							<Fact size="xs" title="Type" text={capitalise(String(ctx.dataset.type))}></Fact>
							<Fact
								size="xs"
								title="Created"
								text={DateTime.fromISO(String(ctx.dataset.metadata_created)).toLocaleString(
									DateTime.DATETIME_FULL
								)}
							></Fact>
							<Fact
								size="xs"
								title="Modified"
								text={DateTime.fromISO(String(ctx.dataset.metadata_modified)).toLocaleString(
									DateTime.DATETIME_FULL
								)}
							></Fact>
							<Fact size="xs" title="Resources" text={String(ctx.dataset.num_resources)}></Fact>
							{#if ctx.dataset.tags && ctx.dataset.tags.length > 0}
								<Fact size="xs" title="Tags">
									<div class="tags">
										{#each ctx.dataset.tags as tag}
											<div class="button-wapper">
												<Button href={`/datasets?tags=${tag.name}`} style="tag"
													>{tag.display_name}</Button
												>
											</div>
										{/each}
									</div>
								</Fact>
							{/if}
						</div>
					</Accordion>
				</div>
				<div class="right-col">
					<Product></Product>
					<Stream activities={data.activities}></Stream>
				</div>
			</div>
		</BaseSection>
	{/if}
</div>

<style>
	.page {
		color: var(--text);
	}
	.dataset-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
		grid-template-rows: minmax(0, 1fr);
		gap: 2rem;
	}
	.right-col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.trigger-button {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--text);
		width: 100%;
	}
	.facts {
		display: grid;
		grid-auto-flow: row;
		gap: 1rem;
	}
	.tags {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		padding: 1rem 0;
	}
</style>
