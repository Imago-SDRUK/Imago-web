<script lang="ts">
	import { Button, Title } from '@imago/ui'
	import { enhance } from '$app/forms'
	import CardQuestion from '$lib/ui/forms/card_question.svelte'
	import QuestionInputs from '$lib/ui/forms/question_inputs.svelte'
	import { handleEnhance } from '$lib/utils/forms/index.js'
	import { DateTime } from 'luxon'
	import type { Question } from '$lib/server/entities/models/questions.js'
	let { data } = $props()
	let questions = $derived.by(() => {
		let questions = $state(data.questions)
		return questions
	})

	let question: Question = $state({
		id: '',
		conditionals: [],
		question: '',
		required: false,
		status: 'draft',
		visibility: false,
		created_by: '',
		updated_by: '',
		created_at: DateTime.now().toJSDate(),
		deleted_at: DateTime.now().toJSDate(),
		updated_at: DateTime.now().toJSDate(),
		description: '',
		group: '',
		label: '',
		options: [],
		type: null
	})
</script>

<div class="page">
	<div class="left-col">
		<Title>Add a question</Title>
		<form
			class="form"
			action="?/create_question"
			use:enhance={handleEnhance({
				// onsuccess: () => {
				// 	resetQuestion()
				// }
			})}
			method="post"
		>
			<div class="inputs">
				<QuestionInputs bind:question questions={data.questions}></QuestionInputs>
			</div>
			<div class="buttons">
				<Button type="reset">Clear</Button>
				<Button type="submit">Save</Button>
			</div>
		</form>
	</div>
	<div class="right-col">
		<Title size="md">Existing questions</Title>
		{#each questions as question, index (question.id)}
			<CardQuestion {questions} bind:question={questions[index]}></CardQuestion>
		{/each}
	</div>
</div>

<style>
	.page {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr);
		gap: 4rem;
	}
	.left-col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.right-col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.form {
		background-color: var(--background);
		border-radius: var(--radius);
		padding: var(--padding-xl);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.inputs {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.buttons {
		display: flex;
		gap: 0.25rem;
		justify-content: space-between;
	}
</style>
