<script lang="ts">
	import { generateKeyBetween } from 'fractional-indexing'
	import { enhance } from '$app/forms'
	import { Button, BaseCard, Subtitle, Icon, ActionBar, Paragraph } from '@imago/ui'
	import { invalidateAll } from '$app/navigation'
	import QuestionInputs from '../forms/question_inputs.svelte'
	import type { Question } from '$lib/server/entities/models/questions'
	import { handleEnhance } from '$lib/utils/forms'
	import Facts from '../cards/facts.svelte'
	import { questionUpdateSort } from '$lib/remotes/questions/update.remote'
	let {
		question = $bindable(),
		questions,
		sorting = $bindable(),
		allow_manage = false
	}: {
		question: Question
		questions: Question[]
		sorting: { dragging: string | null }
		allow_manage?: boolean
	} = $props()
	let open = $state(false)
	const index = $derived(questions.findIndex((q) => q.id === question.id))
	const handleSort = async () => {
		const current = structuredClone($state.snapshot(sorting))
		if (current.dragging === question.id) {
			return
		}
		const sort = generateKeyBetween(questions[index - 1]?.sort, question.sort)
		if (current.dragging) {
			await questionUpdateSort({ sort, id: current.dragging })
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
					{#if allow_manage}
						<Button
							active={open}
							onclick={() => {
								open = !open
							}}
						>
							<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
						</Button>
					{/if}
				{/snippet}
			</ActionBar>
			{#if open && allow_manage}
				<form action="?/delete_question" method="post" use:enhance={handleEnhance()}>
					<input type="text" hidden value={question.id} name="id" />
					<Button>
						<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
					</Button>
				</form>
				<form class="form" action="?/update_question" method="post" use:enhance={handleEnhance()}>
					<div class="inputs">
						<input type="text" hidden bind:value={question.id} name="id" />
						<input type="hidden" bind:value={question.sort} name="sort" />
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
			{#if !allow_manage}
				<Facts record={question} keys={['id', 'created_at', 'updated_at', 'description']}></Facts>
				{#if question.type === 'select'}
					<Paragraph>Options</Paragraph>
					{#each question.options as options}
						<Facts record={options} keys={['label']}></Facts>
					{/each}
				{/if}

				{#if question.conditionals && question.conditionals.length > 0}
					<Paragraph>Conditionals</Paragraph>
					{#each question.conditionals as condition}
						<Facts record={condition} keys={['question', 'operator', 'action', 'value']}></Facts>
					{/each}
				{/if}
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
