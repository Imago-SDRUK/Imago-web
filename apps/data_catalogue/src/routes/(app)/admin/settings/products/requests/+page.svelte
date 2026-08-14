<script lang="ts">
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { BaseSection } from '@imago/ui'
	import type { IColumnConfig } from '@svar-ui/svelte-grid'
	let { data } = $props()
	const product_requests_columns: (IColumnConfig & {
		id: keyof (typeof data.product_requests.items)[0]
		// id: 'first_name' | 'last_name' | 'id' | 'email' | 'groups'
	})[] = [
		{
			id: 'product_id',
			header: 'Product id',
			cell: CellText,
			width: 300
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
			width: 350
		},
		{
			id: 'updated_at',
			header: 'Updated at',
			cell: CellText,
			width: 350
		}
	]
</script>

<div class="page">
	<BaseSection style="title" title="Product requests">
		<BaseTable columns={product_requests_columns} data={data.product_requests.items}></BaseTable>
	</BaseSection>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 4rem;
	}
</style>
