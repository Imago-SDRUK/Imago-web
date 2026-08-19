<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { productResourceDelete } from '$lib/remotes/products/resources/delete.remote'
	import Facts from '$lib/ui/cards/facts.svelte'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import CellEditorCtx from '$lib/ui/tables/cell_editor_ctx.svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { jstr } from '@arturoguzman/art-ui'
	import { ActionBar, BaseSection, Button, handleSearchParams, Icon, SectionEdit } from '@imago/ui'
	import type { IColumnConfig } from '@svar-ui/svelte-grid'
	let { data } = $props()
	const product_requests_columns: (IColumnConfig & {
		id: keyof (typeof data.product_requests.items)[0]
		// id: 'first_name' | 'last_name' | 'id' | 'email' | 'groups'
	})[] = [
		{
			id: 'product_id',
			header: 'Product id',
			cell: CellEditorCtx,
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

	let resource_selected = $derived(
		data.product_requests.items.findIndex(
			(product) => product.id === page.url.searchParams.get('edit')
		) ?? -1
	)
</script>

<div class="page">
	<BaseSection style="title" title="Product resources">
		<SectionEdit open={resource_selected > -1 ? true : undefined}>
			{#snippet leftCol()}
				<BaseTable
					columns={product_requests_columns}
					data={data.product_requests.items}
					query="edit-product"
					onopeneditor={({ row }) => {
						if (row?.product_id) {
							goto(
								handleSearchParams({
									toggle: [{ key: 'edit', value: row.id }],
									url: page.url
								})
							)
						} else {
							goto(page.url.pathname)
						}
					}}
				></BaseTable>
			{/snippet}
			{#snippet rightCol()}
				{#if data.resource}
					<ActionBar>
						{#snippet right()}
							<form
								{...productResourceDelete.enhance(async ({ submit }) => {
									const valid = await submit()
									if (valid) {
										goto(page.url.pathname)
									}
								})}
							>
								<input
									{...productResourceDelete.fields.id.as('hidden', data.resource.resource.id)}
								/>
								<Button>
									<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
								</Button>
							</form>
						{/snippet}
					</ActionBar>
					<Facts record={data.resource?.resource}></Facts>
				{/if}
				<pre>{jstr(data.resource)}</pre>
			{/snippet}
		</SectionEdit>
	</BaseSection>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 4rem;
	}
</style>
