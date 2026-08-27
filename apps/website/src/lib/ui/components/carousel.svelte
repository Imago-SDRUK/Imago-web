<script lang="ts" generics="T">
	type Asset = {
		id: string
		title: string | null
		type: string | null
		description: string
		resource?: DirectusFile
		url?: string
		code?: string
	}
	import { getId, Picture } from '@arturoguzman/art-ui'
	import LottiePlayer from '../players/lottie_player.svelte'
	import type { BlocksExternalAsset, DirectusFile } from '$lib/types/directus'
	import { Paragraph, Icon } from '@imago/ui'
	let {
		enable_description,
		media = [],
		external_assets = []
	}: {
		enable_description?: boolean
		external_assets?: BlocksExternalAsset[] | null
		media?:
			| ({
					directus_files_id: DirectusFile | DirectusFile['id'] | null
			  } & T)[]
			| null
	} = $props()
	const id = getId()
	const assets: Asset[] = $derived(
		[
			...(media?.map(({ directus_files_id }) => {
				if (directus_files_id && typeof directus_files_id !== 'string') {
					return {
						id: directus_files_id.id,
						title: directus_files_id.title,
						type: directus_files_id.type,
						description: directus_files_id.description ?? '',
						resource: directus_files_id
					}
				}
				return null
			}) ?? []),
			...(external_assets?.map(({ external_assets_id }) => {
				if (external_assets_id && typeof external_assets_id !== 'string') {
					return {
						id: external_assets_id.id,
						title: external_assets_id.title,
						type: external_assets_id.type,
						description: external_assets_id.description,
						url: external_assets_id.url ?? undefined,
						code: external_assets_id.code ?? undefined
					}
				}
				return null
			}) ?? [])
		].filter((x) => x !== null)
	)
	let current = $state(0)
</script>

{#if assets.length > 0}
	<div class="carousel" id="carousel-{id}">
		<div class="assets">
			{#each assets as asset, index}
				<div class="asset" id="carousel-{id}-{index}">
					{#if asset.type?.startsWith('image/')}
						<Picture image={asset.resource} alt={asset.description ?? asset.title}></Picture>
					{/if}
					{#if asset.type === 'application/json'}
						<LottiePlayer src="/assets/{asset.id}"></LottiePlayer>
					{/if}
					{#if asset.type === 'youtube' && asset.url}
						{@const video_id = new URL(asset.url).searchParams.get('v')}
						<iframe
							class="iframe"
							data-style="youtube"
							width="100%"
							height="100%"
							title={asset.title ?? 'YouTube video player'}
							src="https://www.youtube-nocookie.com/embed/{video_id}?autoplay=0&rel=0"
							frameborder="0"
							allow="autoplay; picture-in-picture; clipboard-write"
							allowfullscreen
						></iframe>
					{/if}
					{#if asset.type === 'iframe' && asset.url}
						<iframe height="400" width="100%" title={asset.title} src={asset.url}></iframe>
					{/if}
				</div>
			{/each}
		</div>
		{#if enable_description && (assets[current].title || assets[current].description)}
			<div class="description">
				{#if assets[current].title}
					<Paragraph size="xs" align="left" weight={300}>{assets[current].title}</Paragraph>
				{/if}
				{#if assets[current].description}
					<Paragraph size="xs" weight={200}>
						{@html assets[current].description}
					</Paragraph>
				{/if}
			</div>
		{/if}
		{#if assets.length > 1}
			{#if current > 0}
				<button
					class="left-button"
					onclick={() => {
						current--
						document
							.getElementById(`carousel-${id}-${current}`)
							?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
					}}
				>
					<Icon icon={{ icon: 'arrow-left-01', set: 'hugeicons', size: 'lg' }}></Icon>
				</button>
			{/if}
			{#if assets.length - 1 > current}
				<button
					onclick={() => {
						current++
						document
							.getElementById(`carousel-${id}-${current}`)
							?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
					}}
					class="right-button"
				>
					<Icon icon={{ icon: 'arrow-right-01', set: 'hugeicons', size: 'lg' }}></Icon>
				</button>
			{/if}

			<div class="carousel-nav-buttons">
				{#each assets as asset, index}
					{#if asset.resource}
						<button
							class="circle-button"
							data-active={current === index ? true : undefined}
							onclick={() => {
								document
									.getElementById(`carousel-${id}-${index}`)
									?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
								current = index
							}}
						>
							<Icon
								icon={{
									icon: 'circle-filled',
									set: 'tabler',
									size: current === index ? 'lg' : 'md'
								}}
							></Icon>
						</button>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.carousel {
		position: relative;
		--theme-colour-text: var(--text);
		--theme-font-paragraph: var(--paragraph);
	}
	.assets {
		display: flex;
		overflow: scroll;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
		width: 100%;
	}
	button {
		height: 100%;
		color: var(--background);
		cursor: pointer;
	}
	.left-button {
		position: absolute;
		left: 0;
		top: 0;
		color: var(--highlight);
	}
	.right-button {
		position: absolute;
		right: 0;
		top: 0;
		color: var(--highlight);
	}
	.assets > * {
		scroll-snap-align: start;
		flex-grow: 0;
		flex-shrink: 0;
	}
	.asset {
		width: 100%;
	}
	.carousel-nav-buttons {
		position: absolute;
		bottom: 0.5rem;
		left: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: white;
		border: 1px solid var(--highlight);
		border-radius: 999px;
		padding: 0.05rem 0.35rem;
		transform: translate(-50%, 0);
	}
	.circle-button {
		display: flex;
		color: var(--quarternary);
	}
	.circle-button[data-active] {
		display: flex;
		color: var(--highlight);
	}
	.description {
		background-color: color-mix(in oklab, var(--background-muted) 20%, var(--background) 80%);
		padding: 0 0.5rem;
		/* text-align: right; */
	}
	.iframe[data-style='youtube'] {
		aspect-ratio: 16 / 9;
	}
</style>
