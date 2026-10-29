<script lang="ts">
	import { createPlaygroundRequest } from '$lib/remotes/playground/create.remote'
	import { notify } from '$lib/stores/notify.js'
	import {
		BaseSection,
		Button,
		Input,
		Notice,
		Paragraph,
		Select,
		Subtitle,
		BaseCard
	} from '@imago/ui'
	import { productGetOptions } from '$lib/remotes/products/read.remote.js'
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'

	let { data } = $props()
	const products = $derived(data.products)

	let selected = $state('')
	const product = $derived(products.items.find((product) => product.id === selected))
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
					const valid = await submit()
					if (valid) {
						notify.send({ message: result?.message })
						goto(resolve(`/playground/requests`))
					}
				})}
			>
				{#each createPlaygroundRequest.fields.allIssues() as issue}
					<Notice level="negative">
						<Paragraph>{issue.message}</Paragraph>
					</Notice>
				{/each}
				<div class="inputs">

					{#each products.items as product}
						<BaseCard border rounded shadow border_size="thick" style="padded" hover="option">
							<!-- add selected as class if product is selected -->
							<div class="playground-card">
								<div class="playground-card-header">
									<h4 class="playground-card-eyebrow">{product.name}</h4>
									<Subtitle size="md" weight={600}>{product.long_name}</Subtitle>
								</div>
								<Paragraph size="2xl" family="subtitle" weight={400}
									><em>SPF</em> (Sun Probability Framework) aims to measure sunlight exposure across the
									UK.</Paragraph
								>
							</div>
						</BaseCard>
					{/each}

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
									options={product.years.map((year) => ({ label: year, value: year }))}
									{...createPlaygroundRequest.fields.year.as('select')}
								></Select>
							</Input>
						{/if}
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
									{...createPlaygroundRequest.fields.version.as('select')}
								></Select>
							</Input>
						{/if}
						{#if selected !== ''}
							{#each await productGetOptions({ id: selected }) as option_group, index}
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
					<Button style="alt">Request</Button>
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
	/* :global(.card:hover) {
		border: 2px solid var(--border);
		cursor: pointer;
	} */
	.playground-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.playground-card-header {
		display: flex;
		flex-direction: column;
	}
	.playground-card-eyebrow {
		font-size: clamp(0.75rem, 0.7rem + 0.5vw, 0.875rem);
		font-family: var(--title);
		font-weight: 400;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text);
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
</style>
