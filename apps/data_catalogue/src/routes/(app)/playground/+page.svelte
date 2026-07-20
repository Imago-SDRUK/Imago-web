<script lang="ts">
	import type { ProductsProductOptions } from '$lib/server/entities/models/products.js'
	import type { Product, ProductOption } from '$lib/db/schema/index.js'
	import { createPlaygroundRequest } from '$lib/remotes/playground/create.remote'
	import { notify } from '$lib/stores/notify.js'
	import { capitalise } from '@arturoguzman/art-ui'
	import { BaseSection, Button, Input, Notice, Paragraph, Select, Subtitle } from '@imago/ui'
	import { DateTime } from 'luxon'

	let { data } = $props()
	const products: Product[] = [
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			id: '272b7c3a-650d-4bb8-b9bb-e85c27261540',
			name: 'SPF',
			versions: ['0.0.1', '0.0.2', '0.1.0', '1.0.0', '2.0.0'],
			years: [2017, 2018, 2019]
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			id: 'ed4d0894-fcea-4ec4-9a1a-bc5de4415494',
			name: 'Clive',
			versions: ['0.0.1', '0.0.2', '0.0.3'],
			years: [2022, 2023, 2024, 2025]
		}
	]
	const product_options: ProductOption[] = [
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			id: 'd7478316-a059-47bb-83ff-ac1e49a3b706',
			name: 'First geography',
			type: 'geography',
			value: 'first_geography'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			id: '63fe24ae-5952-4cf2-abea-9ffc301ce39e',
			name: 'Second geography',
			type: 'geography',
			value: 'second_geography'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			id: 'a9c093c8-0182-45df-b4b2-265f0c414249',
			name: 'Arithmetic mean',
			type: 'aggregation',
			value: 'arithmetic_mean'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			id: 'ccbb4c2e-b558-4a66-9452-1b8965debb94',
			name: 'Another mean',
			type: 'aggregation',
			value: 'another_mean'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			id: '03c83cb0-e736-4d5d-b48c-7f7dfccd92e6',
			name: 'Cloud probability',
			type: 'band',
			value: 'cloud_probability'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			id: 'ef05598a-1c15-418f-a8d8-d61812113139',
			name: 'Another probability band',
			type: 'band',
			value: 'another_probability'
		}
	]
	const manys: ProductsProductOptions[] = [
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			product_id: '272b7c3a-650d-4bb8-b9bb-e85c27261540',
			product_option_id: 'd7478316-a059-47bb-83ff-ac1e49a3b706'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			product_id: '272b7c3a-650d-4bb8-b9bb-e85c27261540',
			product_option_id: '63fe24ae-5952-4cf2-abea-9ffc301ce39e'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			product_id: '272b7c3a-650d-4bb8-b9bb-e85c27261540',
			product_option_id: 'a9c093c8-0182-45df-b4b2-265f0c414249'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			product_id: '272b7c3a-650d-4bb8-b9bb-e85c27261540',
			product_option_id: '03c83cb0-e736-4d5d-b48c-7f7dfccd92e6'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			product_id: 'ed4d0894-fcea-4ec4-9a1a-bc5de4415494',
			product_option_id: 'd7478316-a059-47bb-83ff-ac1e49a3b706'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			product_id: 'ed4d0894-fcea-4ec4-9a1a-bc5de4415494',
			product_option_id: '63fe24ae-5952-4cf2-abea-9ffc301ce39e'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			product_id: 'ed4d0894-fcea-4ec4-9a1a-bc5de4415494',
			product_option_id: 'a9c093c8-0182-45df-b4b2-265f0c414249'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			product_id: 'ed4d0894-fcea-4ec4-9a1a-bc5de4415494',
			product_option_id: 'ccbb4c2e-b558-4a66-9452-1b8965debb94'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			product_id: 'ed4d0894-fcea-4ec4-9a1a-bc5de4415494',
			product_option_id: '03c83cb0-e736-4d5d-b48c-7f7dfccd92e6'
		},
		{
			created_at: DateTime.now().toJSDate(),
			updated_at: DateTime.now().toJSDate(),
			created_by: '',
			updated_by: '',
			product_id: 'ed4d0894-fcea-4ec4-9a1a-bc5de4415494',
			product_option_id: 'ef05598a-1c15-418f-a8d8-d61812113139'
		}
	]

	let selected = $state('')
	const product = $derived(products.find((product) => product.id === selected))
	const available_options = $derived(
		manys.filter((ppo) => ppo.product_id === selected).map((ppo) => ppo.product_option_id)
	)
	const options = $derived(
		product_options
			.filter((option) => available_options.includes(option.id))
			.reduce(
				(acc, option) => {
					const index = acc.findIndex((o) => o.group.toLowerCase() === option.type.toLowerCase())
					if (index === -1) {
						acc.push({ group: capitalise(option.type), options: [option] })
						return acc
					}
					acc[index].options.push(option)
					return acc
				},
				[] as { group: string; options: ProductOption[] }[]
			)
	)
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
				{...createPlaygroundRequest.enhance(async ({ submit, element }) => {
					const valid = await submit()
					if (valid) {
						notify.send({ message: `Your request has been submitted` })
						selected = ''
					}
				})}
			>
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
							options={products.map((product) => ({ label: product.name, value: product.id }))}
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
						{#each options as group, index}
							<Input label={group.group}>
								{#snippet message()}
									{#each createPlaygroundRequest.fields.options[index].issues() as issue}
										<Notice level="negative">
											<Paragraph>{issue.message}</Paragraph>
										</Notice>
									{/each}
								{/snippet}
								<Select
									{...createPlaygroundRequest.fields.options[index].as('select')}
									options={group.options.map((option) => ({
										label: option.name,
										value: option.value
									}))}
								></Select>
							</Input>
							<pre></pre>
						{/each}
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
