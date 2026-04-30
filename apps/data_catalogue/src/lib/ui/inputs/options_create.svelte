<script lang="ts">
	import { getId } from '@arturoguzman/art-ui'
	import { Button, Icon, Paragraph } from '@imago/ui'
	import { notify } from '$lib/stores/notify'
	import Option from './option.svelte'
	import type { Question } from '$lib/server/entities/models/questions'
	let {
		options = $bindable()
	}: {
		options: Question['options']
	} = $props()
	const id = `options-${getId()}`
	let internal_options: { label: string; value: string; id: string; error: boolean }[] | undefined =
		$state(options?.map((option) => ({ ...option, id: getId(), error: false })))
	const handleAddOption = ({
		index = 0,
		options = []
	}: {
		index?: number
		options?: { label: string; value: string; id: string; error: boolean }[]
	}) => {
		if (options.length === 0) {
			const new_options = [...options, { label: '', value: '', id: getId(), error: false }]
			return new_options
		}
		if (options[index - 1].label === '' || options[index - 1].value === '') {
			notify.send(`Please fill out the last entry.`)
			return options
		}
		const new_options = [...options, { label: '', value: '', id: getId(), error: false }]
		return new_options
	}
</script>

<div class="field-header">
	<Paragraph>Options</Paragraph>
	<div class="buttons">
		<Button
			type="button"
			onclick={() => {
				internal_options = handleAddOption({
					index: internal_options?.length,
					options: internal_options
				})
			}}
		>
			<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
		</Button>
	</div>
</div>

<div class="options">
	<div class="options-inputs">
		{#if internal_options}
			{#each internal_options as extra, index (extra.id)}
				<Option {index} {id} bind:option={internal_options[index]} bind:options={internal_options}>
					{#snippet button()}
						<Button
							style="square"
							type="button"
							onclick={() => {
								if (internal_options) {
									internal_options = [
										...internal_options.slice(0, index),
										...internal_options.slice(index + 1)
									]
								}
							}}
						>
							<Icon icon={{ icon: 'minus', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
				</Option>
			{/each}
		{/if}
	</div>
</div>

<style>
	.field-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.buttons {
		display: flex;
		gap: 0.5rem;
	}
	.options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.options-inputs {
		display: grid;
		grid-auto-flow: row;
		gap: 0.5rem;
	}
	.buttons {
		display: flex;
		justify-content: space-between;
	}
</style>
