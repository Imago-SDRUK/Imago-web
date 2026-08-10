<!--
  @component *Section*
  This should be the upmost wrapper before the page - a block that aligns the content
  to fit inside the margins of the page.

  Styles
  - bleed: content will use the full width and height of the page
  - break: content will use the full width of the page
-->

<script lang="ts">
	import { fly } from 'svelte/transition'
	import type { Snippet } from 'svelte'
	import { Subtitle, Title } from '../text'
	let {
		title,
		style,
		children
	}: {
		title?: string
		children?: Snippet
		style?: 'base' | 'bleed' | 'break' | 'full-page' | 'slim' | 'large' | 'extra-large' | 'title'
	} = $props()
</script>

<section data-style={style} in:fly={{ y: 40 }}>
	{#if style === 'title'}
		<header class="title">
			<!-- <Subtitle weight={800}>{title}</Subtitle> -->
			<Title>{title}</Title>
		</header>
	{/if}
	<div class="content">
		{@render children?.()}
	</div>
</section>

<style>
	section {
		padding: 1rem 1rem 4rem 1rem;
		width: min(100% - 4rem, 1440px);
		margin-inline: auto;
		position: relative;
	}

	section[data-style='base'] {
		width: min(100% - 1rem, 1280px);
		margin-inline: auto;
		background-color: var(--background);
		padding: 1rem;
	}

	section[data-style='bleed'] {
		/* max-width: 100lvw; */
		width: 100%;
		min-height: 100lvh;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr);
		padding: 0;
	}

	section[data-style='break'] {
		width: 100lvw;
		padding: 0;
	}

	section[data-style='full-page'] {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr);
		min-height: 100lvh;
	}

	section[data-style='slim'] {
		width: min(100% - 1rem, 1024px);
		margin-inline: auto;
	}

	section[data-style='large'] {
		width: min(100% - 1rem, 1440px);
		margin-inline: auto;
	}

	section[data-style='extra-large'] {
		width: min(100% - 1rem, 1980px);
		margin-inline: auto;
		min-height: 100lvh;
	}

	section[data-style='title'] {
		padding: 1rem 1rem 2rem 1rem;
		width: min(100% - 4rem, 1440px);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, max-content) minmax(0, 1fr);
		gap: 1rem;
	}
	.title {
		background-color: var(--background-muted);
		padding: 0.25rem 1rem;
		border-radius: var(--radius);
	}

	@media (min-width: 768px) {
		section {
			padding: 2rem;
		}
		section[data-style='break'] {
			padding: 0;
		}
		section[data-style='bleed'] {
			padding: 0;
		}
		section[data-style='full-page'] {
			padding: 0 2rem;
		}
	}
</style>
