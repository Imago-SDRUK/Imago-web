<script lang="ts">
	import { Grid, type IColumnConfig, type IRow, type IApi } from '@svar-ui/svelte-grid'
	import { browser } from '$app/environment'
	import { onMount, type Snippet } from 'svelte'
	import { fuzzy } from '@arturoguzman/art-ui'
	import { Text, Input } from '@imago/ui'
	import { setTableContext } from './table_ctx.svelte'
	import { page } from '$app/state'
	let {
		active,
		query,
		columns,
		data,
		children,
		apiFn,
		enable_search,
		onopeneditor
	}: {
		active?: string
		query?: string
		columns: IColumnConfig[]
		data: IRow[]
		children?: Snippet
		apiFn?: (api: IApi) => void
		enable_search?: boolean
		onopeneditor?: (ev: { [key: string]: unknown }) => void
	} = $props()
	const table_state = $state({
		active: query ? (page.url.searchParams.get(query) ?? '') : ''
	})

	setTableContext({
		state: table_state
	})

	let enabled = $state(false)
	let search_term = $state('')
	let filtered = $derived(
		search_term === ''
			? data
			: data.filter((row) => {
					return Object.values(row).some((val) => {
						if (typeof val === 'string') {
							return fuzzy(search_term, val)
						}
						return false
					})
				})
	)

	const init = (api: IApi) => {
		apiFn?.(api)
	}

	onMount(() => {
		enabled = true
	})
</script>

{#if browser && enabled}
	<div class="table-header">
		<div class="left-col">
			{@render children?.()}
		</div>
		<div class="centre-col"></div>
		<div class="right-col">
			{#if enable_search}
				<Input label="Search">
					<Text bind:value={search_term}></Text>
				</Input>
			{/if}
		</div>
	</div>

	<div class="table">
		<Grid {columns} data={filtered} {init} {onopeneditor}></Grid>
	</div>
{/if}

<style>
	.table-header {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.left-col,
	.centre-col {
		display: grid;
		align-content: center;
	}
	.table {
		--wx-table-select-background: var(--background);
		--wx-table-select-focus-background: var(--background-muted);
		--wx-table-select-color: var(--text);
		--wx-table-border: var(--border);
		/* --wx-table-select-border: inset 3px 0 var(--border-accent); */
		--wx-table-header-border: var(--border-muted);
		--wx-table-header-cell-border: var(--border);
		--wx-table-footer-cell-border: var(--border);
		--wx-table-cell-border: var(--border);
		--wx-header-font-weight: 400;
		--wx-table-header-background: var(--background-muted);
		--wx-table-fixed-column-right-border: 3px solid var(--border);
		--wx-table-editor-dropdown-border: var(--border);
		--wx-table-editor-dropdown-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.6);
		font-family: var(--paragraph);
		width: 100%;
		display: block;
		color: var(--text);
	}
	/**/
	/* :global(.wx-row:not(.wx-selected) .wx-cell) { */
	/* 	background: var(--background-muted); */
	/* } */
	/* :global(.wx-row:not(.wx-selected) .wx-cell) { */
	/* 	background: var(--background-accent); */
	/* } */
</style>
