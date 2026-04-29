<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button, BaseCard, Subtitle, Icon, ActionBar } from '@imago/ui'
	import { invalidateAll } from '$app/navigation'
	import QuestionInputs from '../forms/question_inputs.svelte'
	import type { Question } from '$lib/server/entities/models/questions'
	import { handleEnhance } from '$lib/utils/forms'
	let { question = $bindable(), questions }: { question: Question; questions: Question[] } =
		$props()
	let open = $state(false)
</script>

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

<style>
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
