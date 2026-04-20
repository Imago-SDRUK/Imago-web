<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { notify } from '$lib/stores/notify.js'
	import Answer from '$lib/ui/forms/answer.svelte'
	import { jstr } from '@arturoguzman/art-ui'
	import { BaseSection, BaseCard, Button, Title } from '@imago/ui'
	let { data } = $props()
	let answers = $derived.by(() => {
		let value = $state(
			data.questions.map((question) => ({
				question: String(question.id),
				answer: ''
			}))
		)
		return value
	})
</script>

<BaseSection>
	<div class="page">
		<div class="left-col">
			<Title size="lg">Create your profile</Title>
			<BaseCard>
				<div class="answer-card">
					<form
						class="form"
						action="?/create"
						method="post"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'error') {
									notify.send(String(result.error.message))
								}
								if ('data' in result && result.data) {
									if ('errors' in result.data) {
										if (typeof result.data.errors === 'string') {
											notify.send(String(jstr(result.data.errors)))
										}
										if (
											typeof result.data.errors === 'object' &&
											result.data.errors &&
											!Array.isArray(result.data.errors)
										) {
											Object.entries(result.data.errors).forEach((entry) =>
												notify.send({ message: `${entry[1]}` })
											)
										}
										if (
											typeof result.data.errors === 'object' &&
											result.data.errors &&
											Array.isArray(result.data.errors)
										) {
											result.data.errors.forEach((error) =>
												Object.entries(error).forEach((entry) =>
													notify.send({ message: `${entry[0]}: ${entry[1]}` })
												)
											)
										}
									}
								}
								if (result.type === 'redirect') {
									applyAction(result)
								}
							}
						}}
					>
						<div class="inputs">
							{#each data.questions as question}
								<Answer bind:answers {question}></Answer>
							{/each}
						</div>
						<Button>Create</Button>
					</form>
				</div>
			</BaseCard>
		</div>
	</div>
</BaseSection>

<style>
	.page {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr);
		width: min(100% - 2rem, 600px);
		margin-inline: auto;
	}
	.left-col {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.form {
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
	.answer-card {
		background-color: var(--background-accent);
		padding: 1rem;
		border-radius: var(--radius);
		border: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
