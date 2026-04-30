<script lang="ts">
	import type { Snippet } from 'svelte'
	let { leftCol, rightCol, open }: { leftCol: Snippet; rightCol: Snippet; open?: boolean } =
		$props()
</script>

<div class="section-edit" data-open={open}>
	<div class="left-col">
		{@render leftCol()}
	</div>
	<div class="right-col" data-open={open}>
		{@render rightCol()}
	</div>
</div>

<style>
	.section-edit {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0fr);
		grid-auto-flow: row;
		transition: all 0.1s linear;
	}
	.section-edit[data-open] {
		grid-template-columns: minmax(0, 0fr) minmax(0, 1fr);
	}
	.left-col {
		overflow: hidden;
	}
	.right-col {
		overflow-x: hidden;
		scrollbar-width: none;
		transition: all 0.6s linear;
	}

	@media (min-width: 1280px) {
		.section-edit[data-open] {
			grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
			gap: 3rem;
		}
		.right-col {
			/* position: absolute; */
			/* right: -100%; */
			/* top: var(--header-height); */
			/* transition: all 0.3s ease-in-out; */
			/* overflow: scroll; */
			/* padding: 2rem 3rem; */
			/* background-color: var(--background); */
			/* height: calc(100lvh - var(--header-height)); */
			/* width: 33lvw; */
			opacity: 0;
			/* pointer-events: none; */
			/* z-index: -1; */
		}
		.right-col[data-open] {
			opacity: 1;
			/* pointer-events: all; */
			/* right: 0; */
			border-left: 1px dotted var(--border-accent);
			padding-left: 2rem;
			/* overflow: scroll; */
			/* z-index: 22; */
		}
	}
</style>
