<script lang="ts">
	import { generateKeyBetween } from 'fractional-indexing'
	import { enhance } from '$app/forms'
	import { Button, BaseCard, Subtitle, Icon, ActionBar } from '@imago/ui'
	import { invalidateAll } from '$app/navigation'
	import QuestionInputs from '../forms/question_inputs.svelte'
	import type { Question } from '$lib/server/entities/models/questions'
	import { handleEnhance } from '$lib/utils/forms'
	let {
		question = $bindable(),
		questions,
		sorting = $bindable()
	}: { question: Question; questions: Question[]; sorting: { dragging: string | null } } = $props()
	let open = $state(false)
	const index = $derived(questions.findIndex((q) => q.id === question.id))
	const handleSort = async () => {
		const current = structuredClone($state.snapshot(sorting))
		if (current.dragging === question.id) {
			return
		}
		const sort = generateKeyBetween(questions[index - 1]?.sort, question.sort)
		if (current.dragging) {
			await fetch(`/api/v1/questions/${current.dragging}`, {
				method: 'POST',
				body: JSON.stringify({ sort: sort })
			}).catch((err) => console.log(err))
			await invalidateAll()
		}
	}
</script>

<div
	class="drag-and-drop"
	draggable="true"
	role="none"
	ondragstart={() => {
		sorting.dragging = question.id
	}}
	ondragend={(e) => {
		e.stopPropagation()
		e.preventDefault()
		sorting.dragging = null
	}}
	ondragover={(e) => {
		e.stopPropagation()
		e.preventDefault()
	}}
	ondragenter={(e) => {
		e.stopPropagation()
	}}
	ondragleave={(e) => {
		e.stopPropagation()
	}}
	ondrop={async (e) => {
		e.stopPropagation()
		await handleSort()
	}}
>
	<BaseCard>
		<div class="question-card">
			<ActionBar>
				{#snippet left()}
					<Subtitle size="sm">{question.question} {question.required ? '*' : ''}</Subtitle>
				{/snippet}

				{#snippet right()}
					<Button
						active={open}
						onclick={() => {
							open = !open
						}}
					>
						<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
					</Button>
				{/snippet}
			</ActionBar>
			{#if open}
				<form action="?/delete_question" method="post" use:enhance={handleEnhance()}>
					<input type="text" hidden value={question.id} name="id" />
					<Button>
						<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
					</Button>
				</form>
				<form class="form" action="?/update_question" method="post" use:enhance={handleEnhance()}>
					<div class="inputs">
						<input type="text" hidden bind:value={question.id} name="id" />
						<input type="text" bind:value={question.sort} name="sort" />

						<QuestionInputs {questions} bind:question></QuestionInputs>
					</div>
					<div class="buttons">
						<Button
							type="button"
							onclick={() => {
								invalidateAll()
							}}>Cancel</Button
						>
						<Button type="submit">Save</Button>
					</div>
				</form>
			{/if}
		</div>
	</BaseCard>
</div>

<style>
	.drag-and-drop {
		display: flex;
		gap: 1rem;
	}
	.question-card {
		background-color: var(--background-accent);
		border-radius: var(--radius);
		padding: var(--padding-xl);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
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
		padding: 0.5rem;
	}
	.buttons {
		display: flex;
		gap: 0.25rem;
		justify-content: space-between;
		padding: 0.5rem;
	}
</style>
