<script lang="ts">
	import type {
		Product,
		ProductOption,
		ProductOptionGroup
	} from '$lib/server/entities/models/products.js'
	import { page } from '$app/state'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import BaseTable from '$lib/ui/tables/base_table.svelte'
	import CellText from '$lib/ui/tables/cell_text.svelte'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import {
		Notice,
		SectionEdit,
		Title,
		Paragraph,
		ActionBar,
		Button,
		Icon,
		Input,
		Text,
		Numerical,
		handleSearchParams,
		Select,
		Subtitle,
		Checkbox
	} from '@imago/ui'
	import type { IColumnConfig } from '@svar-ui/svelte-grid'
	import { productCreate } from '$lib/remotes/products/create.remote'
	import { notify } from '$lib/stores/notify'
	import { productOptionCreate } from '$lib/remotes/products/options/create.remote.js'
	import CellEditorCtx from '$lib/ui/tables/cell_editor_ctx.svelte'
	import { goto } from '$app/navigation'
	import Facts from '$lib/ui/cards/facts.svelte'
	import { productOptionDelete } from '$lib/remotes/products/options/delete.remote.js'
	import { resolve } from '$app/paths'
	import { productDelete } from '$lib/remotes/products/delete.remote'
	import { productOptionGroupCreate } from '$lib/remotes/products/options/groups/create.remote.js'
	import { productOptionGroupDelete } from '$lib/remotes/products/options/groups/delete.remote'

	let { data } = $props()

	let product_selected = $derived(
		data.products.items.findIndex(
			(product) => product.id === page.url.searchParams.get('edit-product')
		) ?? -1
	)

	let option_selected = $derived(
		data.product_options.items.findIndex(
			(product) => product.id === page.url.searchParams.get('edit-product-option')
		) ?? -1
	)

	let group_selected = $derived(
		data.product_option_groups.items.findIndex(
			(product) => product.id === page.url.searchParams.get('edit-product-option-group')
		) ?? -1
	)
	const products_columns: (IColumnConfig & {
		id: keyof Product
		// id: 'first_name' | 'last_name' | 'id' | 'email' | 'groups'
	})[] = [
		{
			id: 'name',
			header: 'Name',
			cell: CellEditorCtx
		},
		{
			id: 'versions',
			header: 'Versions',
			cell: CellText
		},
		{
			id: 'years',
			header: 'Years',
			cell: CellText,
			width: 300
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
	const product_options_columns: (IColumnConfig & {
		id: keyof ProductOption
		// id: 'first_name' | 'last_name' | 'id' | 'email' | 'groups'
	})[] = [
		{
			id: 'name',
			header: 'Name',
			cell: CellEditorCtx
		},
		{
			id: 'value',
			header: 'Value',
			cell: CellText,
			width: 300
		},
		{
			id: 'group_id',
			header: 'Group',
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
	const product_option_groups_columns: (IColumnConfig & {
		id: keyof ProductOptionGroup
		// id: 'first_name' | 'last_name' | 'id' | 'email' | 'groups'
	})[] = [
		{
			id: 'name',
			header: 'Name',
			cell: CellEditorCtx
		},
		{
			id: 'value',
			header: 'Value',
			cell: CellText,
			width: 300
		},
		{
			id: 'required',
			header: 'Required',
			cell: CellText
		},
		{
			id: 'multiple',
			header: 'Multiple',
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
	let versions: string[] = $state([])
	let years: number[] = $state([])
	let options: string[] = $state([])
	const ESCAPE_KEYS = ['Enter', ',']
</script>

<div class="page">
	<SectionEdit open={product_selected > -1 ? true : undefined}>
		{#snippet leftCol()}
			<div class="section">
				<ActionBar>
					{#snippet left()}
						<Title>Products</Title>
					{/snippet}
					{#snippet right()}
						<Button
							onclick={() => {
								toggleDialog(`add-product`)
							}}
						>
							<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
				</ActionBar>
				<BaseTable
					columns={products_columns}
					data={data.products.items}
					query="edit-product"
					onopeneditor={({ row }) => {
						if (row?.id) {
							goto(
								handleSearchParams({
									toggle: [{ key: 'edit-product', value: row.id }],
									remove: ['edit-product-option', 'edit-product-option-group'],
									url: page.url
								})
							)
						} else {
							goto(page.url.pathname)
						}
					}}
				></BaseTable>
				{#if data.products.items.length === 0}
					<Notice level="info">
						<Paragraph>There are no products</Paragraph>
					</Notice>
				{/if}
			</div>
		{/snippet}
		{#snippet rightCol()}
			{#if data.product}
				{@const product = data.product}
				<div class="content">
					<ActionBar>
						{#snippet left()}
							<Subtitle>
								{product.name}
							</Subtitle>
						{/snippet}
						{#snippet right()}
							<Button
								onclick={() => {
									toggleDialog(`delete-product-${product.id}`)
								}}
							>
								<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
							</Button>
						{/snippet}
					</ActionBar>
					<Facts record={product}></Facts>
				</div>
				<Dialog id={`delete-product-${product.id}`}>
					<form
						{...productDelete.enhance(async ({ submit }) => {
							const valid = await submit()
							if (valid) {
								toggleDialog(`delete-product-${product.id}`)
								notify.send({ message: `Product deleted` })
								goto(resolve(page.url.pathname))
							}
						})}
					>
						<Subtitle>Are you sure you want to delete this product?</Subtitle>
						<input {...productDelete.fields.id.as('hidden', product.id)} />
						<div class="buttons">
							<Button
								type="button"
								onclick={() => {
									toggleDialog(`delete-product-${product.id}`)
								}}>Cancel</Button
							>
							<Button>Confirm</Button>
						</div>
					</form>
				</Dialog>
			{/if}
		{/snippet}
	</SectionEdit>
	<SectionEdit open={option_selected > -1 ? true : undefined}>
		{#snippet leftCol()}
			<div class="section">
				<ActionBar>
					{#snippet left()}
						<Title>Product options</Title>
					{/snippet}
					{#snippet right()}
						<Button
							onclick={() => {
								toggleDialog(`add-product-option`)
							}}
						>
							<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
				</ActionBar>
				<BaseTable
					columns={product_options_columns}
					data={data.product_options.items}
					query="edit-product-option"
					onopeneditor={({ row }) => {
						if (row?.id) {
							goto(
								handleSearchParams({
									toggle: [{ key: 'edit-product-option', value: row.id }],
									remove: ['edit-product', 'edit-product-option-group'],
									url: page.url
								})
							)
						} else {
							goto(page.url.pathname)
						}
					}}
				></BaseTable>
				{#if data.products.items.length === 0}
					<Notice level="info">
						<Paragraph>There are no products</Paragraph>
					</Notice>
				{/if}
			</div>
		{/snippet}
		{#snippet rightCol()}
			{#if data.product_option}
				{@const option = data.product_option}
				<div class="content">
					<ActionBar>
						{#snippet left()}
							<Subtitle>
								{option.name}
							</Subtitle>
						{/snippet}
						{#snippet right()}
							<Button
								onclick={() => {
									toggleDialog(`delete-option-${option.id}`)
								}}
							>
								<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
							</Button>
						{/snippet}
					</ActionBar>
					<Facts record={option}></Facts>
				</div>
				<Dialog id={`delete-option-${option.id}`}>
					<form
						{...productOptionDelete.enhance(async ({ submit }) => {
							const valid = await submit()
							if (valid) {
								toggleDialog(`delete-option-${option.id}`)
								notify.send({ message: `Option deleted` })
								goto(resolve(page.url.pathname))
							}
						})}
					>
						<Subtitle>Are you sure you want to delete this option?</Subtitle>
						<input {...productOptionDelete.fields.id.as('hidden', option.id)} />
						<div class="buttons">
							<Button
								type="button"
								onclick={() => {
									toggleDialog(`delete-option-${option.id}`)
								}}>Cancel</Button
							>
							<Button>Confirm</Button>
						</div>
					</form>
				</Dialog>
			{/if}
		{/snippet}
	</SectionEdit>
	<SectionEdit open={group_selected > -1 ? true : undefined}>
		{#snippet leftCol()}
			<div class="section">
				<ActionBar>
					{#snippet left()}
						<Title>Product option groups</Title>
					{/snippet}
					{#snippet right()}
						<Button
							onclick={() => {
								toggleDialog(`add-product-option-group`)
							}}
						>
							<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
				</ActionBar>
				<BaseTable
					columns={product_option_groups_columns}
					data={data.product_option_groups.items}
					query="edit-product-option-group"
					onopeneditor={({ row }) => {
						if (row?.id) {
							goto(
								handleSearchParams({
									toggle: [{ key: 'edit-product-option-group', value: row.id }],
									remove: ['edit-product', 'edit-product-option'],
									url: page.url
								})
							)
						} else {
							goto(page.url.pathname)
						}
					}}
				></BaseTable>
				{#if data.products.items.length === 0}
					<Notice level="info">
						<Paragraph>There are no product option groups</Paragraph>
					</Notice>
				{/if}
			</div>
		{/snippet}
		{#snippet rightCol()}
			{#if data.product_option_group}
				{@const group = data.product_option_group}
				<div class="content">
					<ActionBar>
						{#snippet left()}
							<Subtitle>
								{group.name}
							</Subtitle>
						{/snippet}
						{#snippet right()}
							<Button
								onclick={() => {
									toggleDialog(`delete-option-group-${group.id}`)
								}}
							>
								<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
							</Button>
						{/snippet}
					</ActionBar>
					<Facts record={group}></Facts>
				</div>
				<Dialog id={`delete-option-group-${group.id}`}>
					<form
						{...productOptionGroupDelete.enhance(async ({ submit }) => {
							const valid = await submit()
							if (valid) {
								toggleDialog(`delete-option-${group.id}`)
								notify.send({ message: `Option deleted` })
								goto(resolve(page.url.pathname))
							}
						})}
					>
						<Subtitle>Are you sure you want to delete this option group?</Subtitle>
						<input {...productOptionGroupDelete.fields.id.as('hidden', group.id)} />
						<div class="buttons">
							<Button
								type="button"
								onclick={() => {
									toggleDialog(`delete-option-group-${group.id}`)
								}}>Cancel</Button
							>
							<Button>Confirm</Button>
						</div>
					</form>
				</Dialog>
			{/if}
		{/snippet}
	</SectionEdit>
</div>
<Dialog id="add-product">
	<form
		{...productCreate.enhance(async ({ submit }) => {
			const valid = await submit()
			if (valid) {
				toggleDialog(`add-product`)
				if (productCreate.result) {
					notify.send({ message: productCreate.result.message })
				}
			}
		})}
	>
		<Title>Create product</Title>
		{#each productCreate.fields.allIssues() as issue}
			<Notice level="warning">
				<Paragraph>{issue.message}</Paragraph>
			</Notice>
		{/each}
		<div class="inputs">
			<Input label="Name" required>
				{#each productCreate.fields.name.issues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<Text {...productCreate.fields.name.as('text')}></Text>
			</Input>
			<Input label="Versions" required>
				<div class="tags-input" data-open={versions.length > 0 ? true : undefined}>
					{#each productCreate.fields.versions.issues() as issue}
						<Notice level="negative">
							<Paragraph>{issue.message}</Paragraph>
						</Notice>
					{/each}
					<Text
						onkeydown={(e) => {
							if (ESCAPE_KEYS.includes(e.key)) {
								e.preventDefault()
							}
						}}
						onkeyup={(e) => {
							if (ESCAPE_KEYS.includes(e.key)) {
								e.preventDefault()
								const value = e.currentTarget.value
								if (value !== '') {
									if (versions.includes(value)) {
										notify.send({ message: `Values must be unique` })
										return
									}
									versions.push(e.currentTarget.value)
									e.currentTarget.value = ''
								}
							}
						}}
					></Text>
					<div class="values">
						{#each versions as version, idx}
							<input {...productCreate.fields.versions[idx].as('hidden', version)} />
							<Button
								active
								onclick={() => {
									versions = [...versions.slice(0, idx), ...versions.slice(idx + 1)]
								}}
								type="button"
								style="tag">{version}</Button
							>
						{/each}
					</div>
				</div>
			</Input>
			<Input label="Years" required>
				<div class="tags-input" data-open={years.length > 0 ? true : undefined}>
					{#each productCreate.fields.years.issues() as issue}
						<Notice level="negative">
							<Paragraph>{issue.message}</Paragraph>
						</Notice>
					{/each}

					<Numerical
						onkeydown={(e) => {
							if (ESCAPE_KEYS.includes(e.key)) {
								e.preventDefault()
							}
						}}
						onkeyup={(e) => {
							if (ESCAPE_KEYS.includes(e.key)) {
								e.preventDefault()
								const value = Number(e.currentTarget.value)
								if (value && !Number.isNaN(value)) {
									if (years.includes(value)) {
										notify.send({ message: `Values must be unique` })
										return
									}
									years.push(value)
									e.currentTarget.value = ''
								}
							}
						}}
					></Numerical>
					<div class="values">
						{#each years as year, idx}
							<input {...productCreate.fields.years[idx].as('hidden', year)} />
							<Button
								onclick={() => {
									years = [...years.slice(0, idx), ...years.slice(idx + 1)]
								}}
								type="button"
								style="tag">{year}</Button
							>
						{/each}
					</div>
				</div>
			</Input>

			<Input label="Options" required>
				<div class="tags-input" data-open={options.length > 0 ? true : undefined}>
					{#each productCreate.fields.options.issues() as issue}
						<Notice level="negative">
							<Paragraph>{issue.message}</Paragraph>
						</Notice>
					{/each}
					<Select
						{...productCreate.fields.options.as('select multiple')}
						options={data.product_options.items.map((opt) => ({
							label: `${opt.name}`,
							value: opt.id
						}))}
					></Select>
					<!-- onchange={(value) => { -->
					<!-- 							if (typeof value === 'string') { -->
					<!-- 								if (!options.includes(value)) { -->
					<!-- 									options.push(value) -->
					<!-- 								} -->
					<!-- 							} -->
					<!-- 						}} -->
					<div class="values">
						{#each options as option, idx}
							<input {...productCreate.fields.options[idx].as('hidden', option)} />
							<Button
								onclick={() => {
									options = [...options.slice(0, idx), ...options.slice(idx + 1)]
								}}
								type="button"
								style="tag"
								>{data.product_options.items.find((po) => po.id === option)?.name}</Button
							>
						{/each}
					</div>
				</div>
			</Input>
		</div>

		<div class="buttons">
			<Button
				type="button"
				onclick={() => {
					toggleDialog(`add-product`)
				}}>Cancel</Button
			>
			<Button>Create</Button>
		</div>
	</form>
</Dialog>

<Dialog id="add-product-option">
	<form
		{...productOptionCreate.enhance(async ({ submit }) => {
			const valid = await submit()
			if (valid) {
				toggleDialog(`add-product-option`)
				if (productOptionCreate.result) {
					notify.send({ message: productOptionCreate.result.message })
				}
			}
		})}
	>
		<Title>Create option product</Title>
		{#each productOptionCreate.fields.allIssues() as issue}
			<Notice level="warning">
				<Paragraph>{issue.message}</Paragraph>
			</Notice>
		{/each}
		<div class="inputs">
			<Input label="Name" required>
				{#each productOptionCreate.fields.name.issues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<Text {...productOptionCreate.fields.name.as('text')}></Text>
			</Input>
			<Input label="Type" required>
				{#each productOptionCreate.fields.type.issues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<Text {...productOptionCreate.fields.type.as('text')}></Text>
			</Input>
			<Input label="Value" required>
				{#each productOptionCreate.fields.value.issues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<Text {...productOptionCreate.fields.value.as('text')}></Text>
			</Input>
		</div>
		<div class="buttons">
			<Button
				type="button"
				onclick={() => {
					toggleDialog(`add-product-option`)
				}}>Cancel</Button
			>
			<Button>Create</Button>
		</div>
	</form>
</Dialog>

<Dialog id="add-product-option-group">
	<form
		{...productOptionGroupCreate.enhance(async ({ submit }) => {
			const valid = await submit()
			if (valid) {
				toggleDialog(`add-product-option-group`)
				if (productOptionGroupCreate.result) {
					notify.send({ message: productOptionGroupCreate.result.message })
				}
			}
		})}
	>
		<Title>Create option product</Title>
		{#each productOptionGroupCreate.fields.allIssues() as issue}
			<Notice level="warning">
				<Paragraph>{issue.message}</Paragraph>
			</Notice>
		{/each}
		<div class="inputs">
			<Input label="Name" required>
				{#each productOptionGroupCreate.fields.name.issues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<Text {...productOptionGroupCreate.fields.name.as('text')}></Text>
			</Input>
			<Input label="Required">
				{#each productOptionGroupCreate.fields.required.issues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<Checkbox {...productOptionGroupCreate.fields.required.as('checkbox', true)}></Checkbox>
			</Input>
			<Input label="Multiple">
				{#each productOptionGroupCreate.fields.multiple.issues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<Checkbox {...productOptionGroupCreate.fields.multiple.as('checkbox')}></Checkbox>
			</Input>
		</div>
		<div class="buttons">
			<Button
				type="button"
				onclick={() => {
					toggleDialog(`add-product-option-group`)
				}}>Cancel</Button
			>
			<Button>Create</Button>
		</div>
	</form>
</Dialog>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 4rem;
	}
	.section,
	.content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
	}
	.values {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
	}
	.tags-input {
		display: flex;
		flex-direction: column;
	}
	.tags-input[data-open] {
		gap: 0.5rem;
	}
</style>
