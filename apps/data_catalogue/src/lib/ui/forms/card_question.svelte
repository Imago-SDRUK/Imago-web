<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { notify } from '$lib/stores/notify.js'
	import { Button, BaseCard, Subtitle, Icon } from '@imago/ui'
	import { jstr } from '@arturoguzman/art-ui'
	import { invalidateAll } from '$app/navigation'
	import QuestionInputs from '../forms/question_inputs.svelte'
	import type { Question } from '$lib/server/entities/models/questions'
	let { question = $bindable(), questions }: { question: Question; questions: Question[] } =
		$props()
	let open = $state(false)
</script>

<BaseCard>
	<div class="question-card">
		<div class="card-header">
			<Subtitle>{question.question} {question.required ? '*' : ''}</Subtitle>
			<div class="buttons">
				<Button
					active={open}
					onclick={() => {
						open = !open
					}}
				>
					<Icon icon={{ icon: 'edit', set: 'tabler' }}></Icon>
				</Button>
				<form
					action="?/delete_question"
					method="post"
					use:enhance={() => {
						return async ({ result, update }) => {
							if ('data' in result && result.data) {
								if ('errors' in result.data) {
									notify.send(String(jstr(result.data.errors)))
								}
								if ('message' in result.data) {
									notify.send(String(result.data.message))
								}
							}
							if (result.type === 'redirect') {
								applyAction(result)
							}
							update({ reset: true, invalidateAll: true })
						}
					}}
				>
					<input type="text" hidden value={question.id} name="id" />
					<Button>
						<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
					</Button>
				</form>
			</div>
		</div>
		{#if open}
			<form
				class="form"
				action="?/update_question"
				method="post"
				use:enhance={() => {
					return async ({ result, update }) => {
						if ('data' in result && result.data) {
							if ('errors' in result.data) {
								notify.send(String(jstr(result.data.errors)))
							}
							if ('message' in result.data) {
								notify.send(String(result.data.message))
							}
						}
						if (result.type === 'redirect') {
							applyAction(result)
						}
						update({ invalidateAll: true })
					}
				}}
			>
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
	.card-header {
		display: flex;
		justify-content: space-between;
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
