<script lang="ts">
	import { type ICellProps } from '@svar-ui/svelte-grid'
	import { Button } from '@imago/ui'
	import { getTableContext } from './table_ctx.svelte'
	let { column, row, onaction }: ICellProps = $props()
	const table_state = getTableContext()
	function onClick() {
		if (table_state) {
			if (table_state.active === row.id) {
				table_state.active = ''
			} else {
				table_state.active = row.id
			}
		}
		onaction?.({
			action: 'open-editor',
			data: {
				column: column.id,
				row: row
			}
		})
	}
	const key = $derived(String(column['id']))
</script>

<!-- <BaseCell> -->
<Button onclick={onClick} style="clean" active={table_state?.active === row.id}>
	{row[key]}
</Button>

<!-- </BaseCell> -->

<style>
</style>
