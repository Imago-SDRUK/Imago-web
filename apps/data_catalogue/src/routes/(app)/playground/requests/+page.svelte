<script lang="ts">
	import { productResourceGet } from '$lib/remotes/products/resources/read.remote.js'
	import { notify } from '$lib/stores/notify'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import CellEditorCtx from '$lib/ui/tables/cell_editor_ctx.svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { BaseSection } from '@imago/ui'
	import type { IColumnConfig } from '@svar-ui/svelte-grid'
	let { data } = $props()
	const product_requests_columns: (IColumnConfig & {
		id: keyof (typeof data.product_requests.items)[0]
		// id: 'first_name' | 'last_name' | 'id' | 'email' | 'groups'
	})[] = [
		{
			id: 'product',
			header: 'Product',
			cell: CellEditorCtx
		},
		{
			id: 'year',
			header: 'Year',
			cell: CellText
		},
		{
			id: 'version',
			header: 'Version',
			cell: CellText
		},
		{
			id: 'options',
			header: 'Options',
			cell: CellText
		},
		{
			id: 'status',
			header: 'Status',
			cell: CellText
		},
		{
			id: 'created_at',
			header: 'Created at',
			cell: CellText,
			width: 400
		},
		{
			id: 'updated_at',
			header: 'Updated at',
			cell: CellText,
			width: 400
		}
	]
</script>

<div class="page">
	<BaseSection style="title" title="Previous requests">
		<BaseTable
			columns={product_requests_columns}
			data={data.product_requests.items}
			query="edit-product-option-group"
			onopeneditor={async ({ row }) => {
				try {
					const result = await productResourceGet({ id: row.id })
					console.log(row, result)
				} catch (_err) {
					if ('body' in _err) {
						notify.send({ message: _err.body.message })
					}
				}
			}}
		></BaseTable>
	</BaseSection>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 4rem;
	}
</style>
