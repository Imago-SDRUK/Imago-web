<script lang="ts">
	import {
		Icon,
		Input,
		Select,
		Subtitle,
		Text,
		Button,
		Paragraph,
		Checkbox,
		Editor
	} from '@imago/ui'
	import OptionsCreate from '../inputs/options_create.svelte'
	import type { Question } from '$lib/server/entities/models/questions'

	let {
		question = $bindable(),
		questions
	}: {
		question: Question
		questions: Question[]
	} = $props()

	const options = [
		{ label: 'Text', value: 'string' },
		{ label: 'Select', value: 'select' },
		{ label: 'Select multiple', value: 'multiple_select' },
		{ label: 'Number', value: 'number' },
		{ label: 'Yes / No', value: 'bool' },
		{ label: 'Countries', value: 'countries' }
	]
</script>

<div class="question">
	<input type="hidden" name="question_data" value={JSON.stringify(question)} />
	<div class="question-inputs">
		<Input label="Question" required>
			<Text name="question" required bind:value={question.question}></Text>
		</Input>
		<Input label="Description" required>
			<textarea name="description" hidden bind:value={question.description}></textarea>
			<Editor bind:content={question.description}></Editor>
		</Input>
		{#if question.description && question.description !== ''}
			<Input label="Label" required>
				<Text name="label" bind:value={question.label}></Text>
			</Input>
		{/if}
		<Input label="Type" required>
			<Select name="type" bind:value={question.type} required {options}></Select>
		</Input>
		{#if question.type === 'select' || question.type === 'multiple_select'}
			<OptionsCreate options={question.options}></OptionsCreate>
		{/if}
	</div>
	<div class="section">
		<Subtitle>Settings</Subtitle>
		<div class="settings-toggles">
			<Input label="Visibility" layout="horizontal" subgrid>
				<Checkbox name="visibility" bind:checked={question.visibility}></Checkbox>
			</Input>
			<Input label="Required" layout="horizontal" subgrid>
				<Checkbox name="required" bind:checked={question.required}></Checkbox>
			</Input>
		</div>
		<div class="conditionals">
			<div class="conditionals-header">
				<Paragraph>Conditionals</Paragraph>
				<Button
					type="button"
					onclick={() => {
						if (question.conditionals && Array.isArray(question.conditionals)) {
							question.conditionals.push({
								question: '',
								value: '',
								action: [],
								operator: 'equal'
							})
						}
					}}><Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon></Button
				>
			</div>
			{#if question.conditionals && Array.isArray(question.conditionals) && question.conditionals.length > 0}
				<div class="conditionals">
					{#each question.conditionals as conditional, index}
						<div class="conditional">
							<div class="conditional-header">
								<Paragraph>
									Conditional {index + 1}
								</Paragraph>
								<Button
									type="button"
									onclick={() => {
										if (question.conditionals) {
											question.conditionals = [
												...question.conditionals.slice(0, index),
												...question.conditionals.slice(index + 1)
											]
										}
									}}><Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon></Button
								>
							</div>
							<Input label="Question">
								<Select
									bind:value={conditional.question}
									options={questions.map((question) => ({
										label: question.question,
										value: String(question.id)
									}))}
								></Select>
							</Input>
							<Input label="Operator">
								<Select
									bind:value={conditional.operator}
									options={[
										{ label: 'Equal', value: 'equal' },
										{ label: 'Not equal', value: 'not_equal' },
										{ label: 'Includes', value: 'includes' }
									]}
								></Select>
							</Input>
							<Input label="Value">
								<Text bind:value={conditional.value}></Text>
							</Input>
							<Input label="Action">
								<Select
									multiple
									bind:value={conditional.action}
									options={[
										{ label: 'Visible', value: 'visible' },
										{ label: 'Hidden', value: 'hidden' },
										{ label: 'Required', value: 'required' }
									]}
								></Select>
							</Input>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.question {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.question-inputs {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.settings-toggles {
		display: grid;
		grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
		grid-auto-flow: row;
		justify-items: stretch;
		gap: 0.5rem;
	}
	.conditionals-header {
		display: flex;
		justify-content: space-between;
	}
	.conditional-header {
		display: flex;
		justify-content: space-between;
	}
	.conditionals {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 0;
	}
	.conditional {
		background-color: var(--background-accent);
		padding: 1rem;
		border-radius: var(--radius);
	}
	.section {
		display: grid;
		gap: 0.25rem 1rem;
		grid-template-columns: minmax(0, 1fr);
		grid-auto-flow: row;
		background-color: var(--background-muted);
		padding: 1rem;
		border-radius: var(--radius);
	}
</style>
