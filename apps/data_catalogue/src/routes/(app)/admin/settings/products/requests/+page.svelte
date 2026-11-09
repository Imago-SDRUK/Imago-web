<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { productRequestDelete } from '$lib/remotes/products/requests/delete.remote.js'
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
	let selected = $derived(
		data.product_requests.items.findIndex(
			(product) => product.id === page.url.searchParams.get('edit')
		) ?? -1
	)
</script>

<div class="page">
	<BaseSection style="title" title="Product requests">
		<SectionEdit open={selected > -1 ? true : undefined}>
			{#snippet leftCol()}
				<BaseTable
					columns={product_requests_columns}
					data={data.product_requests.items}
					query="edit-product"
					onopeneditor={({ row }) => {
						if (row?.id) {
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
				{#if data.product_request}
					<ActionBar>
						{#snippet right()}
							<form
								{...productRequestDelete.enhance(async ({ submit }) => {
									const valid = await submit()
									if (valid) {
										goto(page.url.pathname)
									}
								})}
							>
								<input {...productRequestDelete.fields.id.as('hidden', data.product_request.id)} />
								<Button>
									<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
								</Button>
							</form>
						{/snippet}
					</ActionBar>
					<Facts record={data.product_request}></Facts>
				{/if}
				<pre>{jstr(data.product_request)}</pre>
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
