<script lang="ts">
	import { createPlaygroundRequest } from '$lib/remotes/playground/create.remote'
	import { notify } from '$lib/stores/notify.js'
	import { BaseSection, Button, Input, Notice, Paragraph, Select, Subtitle } from '@imago/ui'
	import { productGetOptions } from '$lib/remotes/products/read.remote.js'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'

	let { data } = $props()
	const products = $derived(data.products)

	let selected = $state('')
	const product = $derived(products.items.find((product) => product.id === selected))

	let submitting = $state(false)

	let selected_version = $state('')
	$effect(() => {
		selected
		selected_version = ''
	})

	
	const year_options = $derived(
		selected_version === '1.0' ? (product?.years ?? []).filter((year) => year === 2024) : (product?.years ?? [])
	)

	const option_group_display_order = ['Geographies', 'Format']
	function option_group_rank(name: string) {
		const index = option_group_display_order.indexOf(name)
		return index === -1 ? option_group_display_order.length : index
	}
</script>

<BaseSection>
	<div class="playground-section">
		<div class="left">
			<Subtitle size="lg" weight={500}>Playground</Subtitle>
			<Paragraph
				>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, totam maiores enim
				aliquam accusantium tenetur illum eius consequatur ut ipsam quae porro fuga! Velit dolorem
				magnam totam placeat suscipit molestias.</Paragraph
			>
			<form
				{...createPlaygroundRequest.enhance(async ({ submit, result }) => {
					if (submitting) return
					submitting = true
					try {
						const valid = await submit()
						if (valid) {
							notify.send({ message: result?.message })
							goto(resolve(`/playground/requests`))
						}
					} finally {
						submitting = false
					}
				})}
			>
				{#each createPlaygroundRequest.fields.allIssues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<div class="inputs">
					<Input label="Data product">
						{#snippet message()}
							{#each createPlaygroundRequest.fields.data_product.issues() as issue}
								<Notice level="negative">
									<Paragraph>{issue.message}</Paragraph>
								</Notice>
							{/each}
						{/snippet}
						<Select
							options={products.items.map((product) => ({
								label: product.name,
								value: product.id
							}))}
							name="data_product"
							bind:value={selected}
						></Select>
					</Input>
					{#key selected}
						{#if product?.versions}
							<Input label="Version">
								{#snippet message()}
									{#each createPlaygroundRequest.fields.version.issues() as issue}
										<Notice level="negative">
											<Paragraph>{issue.message}</Paragraph>
										</Notice>
									{/each}
								{/snippet}
								<Select
									options={product.versions.map((version) => ({ label: version, value: version }))}
									name="version"
									bind:value={selected_version}
								></Select>
							</Input>
						{/if}
						{#if product?.years}
							<Input label="Year">
								{#snippet message()}
									{#each createPlaygroundRequest.fields.year.issues() as issue}
										<Notice level="negative">
											<Paragraph>{issue.message}</Paragraph>
										</Notice>
									{/each}
								{/snippet}
								<Select
									options={year_options.map((year) => ({ label: year, value: year }))}
									{...createPlaygroundRequest.fields.year.as('select')}
								></Select>
							</Input>
						{/if}
						{#if selected !== ''}
							{#each [...(await productGetOptions({ id: selected }))].sort((a, b) => option_group_rank(String(a.group)) - option_group_rank(String(b.group))) as option_group, index}
								<Input label={String(option_group.group)}>
									{#snippet message()}
										{#each createPlaygroundRequest.fields.options[index].issues() as issue}
											<Notice level="negative">
												<Paragraph>{issue.message}</Paragraph>
											</Notice>
										{/each}
									{/snippet}
									<Select
										required={option_group.required}
										{...createPlaygroundRequest.fields.options[index].as('select')}
										options={option_group.options.map((option) => ({
											label: option.name ?? '',
											value: option.id ?? option.value ?? ''
										}))}
									></Select>
								</Input>
							{/each}
						{/if}
					{/key}
				</div>
				<div class="buttons">
					<Button style="alt" type="submit" disabled={submitting}>
						{#if submitting}
							<span class="spinner" aria-hidden="true"></span>
							Requesting...
						{:else}
							Request
						{/if}
					</Button>
				</div>
			</form>
		</div>
		<div class="right">
			<img src="/images/terrain_3.svg" alt="" />
		</div>
	</div>
</BaseSection>

<style>
	.playground-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		padding: 2rem 0;
		/* gap: 1rem; */
	}
	.left {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0 2rem;
	}
	.right {
		border-left: 1px solid var(--border);
	}
	img {
		object-fit: cover;
		height: 100%;
		width: 100%;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background-color: var(--background-muted);
		padding: 2rem;
		border-radius: var(--radius);
	}
	.inputs {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.buttons {
		display: flex;
		gap: 0.5rem;
	}
	.spinner {
		width: 0.9rem;
		height: 0.9rem;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: 50%;
		display: inline-block;
		animation: spin 0.6s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
