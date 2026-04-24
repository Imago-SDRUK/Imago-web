<script lang="ts">
	import { COUNTRIES } from '$lib/utils/forms/countries'
	import { Select, Input, Text, Checkbox, Button, Icon } from '@imago/ui'
	import Notes from '../text/notes.svelte'
	import type { Question } from '$lib/server/entities/models/questions'
	let {
		answers = $bindable(),
		question
	}: { answers: { question: string; answer: string }[]; question: Question } = $props()
	let answer = $derived(answers.find((answer) => answer.question === question.id))
	let visibility = $derived.by(() => {
		let value = $state(question.visibility)
		return value
	})
	let desctiption_open = $state(false)
	$effect(() => {
		if (answers && question && question.conditionals && Array.isArray(question.conditionals)) {
			question.conditionals?.forEach((conditional) => {
				const _val = answers.find((_answer) => _answer.question === conditional.question)?.answer
				if (conditional.operator === 'equal') {
					if (_val === conditional.value) {
						if (conditional.action === 'hidden') {
							visibility = false
							return
						}
						if (conditional.action === 'visible') {
							visibility = true
							return
						}
					}
				}
				if (conditional.operator === 'not_equal') {
					if (_val !== conditional.value) {
						if (conditional.action === 'hidden') {
							visibility = false
							return
						}
						if (conditional.action === 'visible') {
							visibility = true
							return
						}
					}
				}
				visibility = question.visibility
			})
		}
	})
</script>

{#if answer && visibility}
	<div class="answer-card">
		<Input label={question.question} required={question.required ? true : false}>
			{#if question.type === 'countries'}
				<Select
					name={question.id}
					required={question.required ? true : false}
					options={COUNTRIES}
					bind:value={answer.answer}
				></Select>
			{/if}
			{#if question.type === 'string'}
				<Text
					name={question.id}
					required={question.required ? true : false}
					bind:value={answer.answer}
				></Text>
			{/if}
			{#if question.type === 'number'}
				<Text
					name={question.id}
					required={question.required ? true : false}
					bind:value={answer.answer}
				></Text>
			{/if}
			{#if question.type === 'bool'}
				<div class="anti-wrap">
					<Checkbox
						required={question.required ? true : false}
						name={question.id}
						onchange={(e) => {
							answer.answer = `${e.currentTarget.checked}`
						}}
					></Checkbox>
				</div>
			{/if}
			{#if question.type === 'select' && question.options}
				<Select
					name={question.id}
					required={question.required ? true : false}
					options={question.options}
					bind:value={answer.answer}
				></Select>
			{/if}
			{#if question.type === 'multiple_select' && question.options}
				<Select
					required={question.required ? true : false}
					multiple
					name={question.id}
					options={question.options}
					bind:value={answer.answer}
				></Select>
			{/if}
		</Input>

		{#if question.description}
			<div class="button">
				<Button
					active={desctiption_open}
					type="button"
					style="clean"
					onclick={() => {
						desctiption_open = !desctiption_open
					}}
					>{#if question.label}
						{question.label}
					{:else}
						<Icon icon={{ icon: 'info-circle-filled', set: 'tabler' }}></Icon>
					{/if}
				</Button>
			</div>
			{#if desctiption_open}
				<div class="description">
					<Notes note={String(question.description)}></Notes>
				</div>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.answer-card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, max-content);
		gap: 1rem;
	}
	.button {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.description {
		grid-column: 1 / -1;
		width: 100%;
		background-color: var(--background-muted);
		padding: 2rem;
		border-radius: var(--radius);
	}
</style>
