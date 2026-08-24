<script lang="ts">
	import { generateKeyBetween } from 'fractional-indexing'
	import {
		ActionBar,
		BaseSection,
		Button,
		Checkbox,
		Icon,
		Input,
		Notice,
		Paragraph,
		Select,
		Subtitle,
		Text,
		Textarea,
		Title
	} from '@imago/ui'
	import CardQuestion from '$lib/ui/forms/card_question.svelte'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import { createQuestion } from '$lib/remotes/questions/create.remote'
	import { notify } from '$lib/stores/notify'
	let { data } = $props()
	let questions = $derived.by(() => {
		let questions = $state(data.questions)
		return questions
	})

	let sorting: { dragging: string | null } = $state({
		dragging: null
	})
	const types = [
		{ label: 'Text', value: 'string' },
		{ label: 'Select', value: 'select' },
		{ label: 'Select multiple', value: 'multiple_select' },
		{ label: 'Number', value: 'number' },
		{ label: 'Yes / No', value: 'bool' },
		{ label: 'Countries', value: 'countries' }
	]
</script>

<BaseSection style="title">
	{#snippet header()}
		<ActionBar>
			{#snippet left()}
				<Title>Questions</Title>
			{/snippet}
			{#snippet right()}
				<Button
					onclick={() => {
						toggleDialog(`add-question`)
					}}
				>
					<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
				</Button>
			{/snippet}
		</ActionBar>
	{/snippet}
	<div class="questions">
		{#each questions as question, index (question.id)}
			<CardQuestion
				allow_manage={data.allow_manage}
				{questions}
				bind:question={questions[index]}
				bind:sorting
			></CardQuestion>
		{/each}
	</div>
</BaseSection>

<Dialog id="add-question">
	<Title>Add question</Title>
	<form
		{...createQuestion.enhance(async ({ submit }) => {
			if (await submit()) {
				notify.send('Question created')
				toggleDialog(`add-question`)
			}
		})}
	>
		{#each createQuestion.fields.allIssues() as issue}
			<Notice level="negative">
				<Paragraph>{issue.message}</Paragraph>
			</Notice>
		{/each}
		<input
			{...createQuestion.fields.sort.as('hidden', generateKeyBetween(questions.at(-1)?.sort, null))}
		/>
		<div class="form-block">
			<Input label="Question">
				<Text {...createQuestion.fields.question.as('text')}></Text>
			</Input>
			<Input label="Description">
				<Textarea {...createQuestion.fields.description.as('text')}></Textarea>
			</Input>
			<Input label="Label">
				<Text {...createQuestion.fields.label.as('text')}></Text>
			</Input>
			<Input label="Type" required>
				<Select
					{...createQuestion.fields.type.as('select')}
					required
					options={types}
					onchange={(e) => {
						if (typeof e === 'string') createQuestion.fields.type.set(e)
					}}
				></Select>
			</Input>
		</div>
		{#if createQuestion.fields.type.value() === 'select' || createQuestion.fields.type.value() === 'multiple_select'}
			<div class="form-block">
				<div class="field-header">
					<ActionBar>
						{#snippet left()}
							<Paragraph>Options</Paragraph>
						{/snippet}
						{#snippet right()}
							<Button
								type="button"
								onclick={() => {
									createQuestion.fields.options.set([
										...(createQuestion.fields.options.value() ?? []),
										{ label: '', value: '' }
									])
								}}
							>
								<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
							</Button>
						{/snippet}
					</ActionBar>
				</div>
				<div class="options">
					<div class="options-inputs">
						{#each createQuestion.fields.options.value() as option, index}
							<div class="option">
								<Input label="Label">
									<Text {...createQuestion.fields.options[index].label.as('text')}></Text>
								</Input>
								<Input label="Value">
									<Text {...createQuestion.fields.options[index].value.as('text')}></Text>
								</Input>
								<div class="wrapper">
									<Button
										type="button"
										onclick={() => {
											const filtered = [
												...createQuestion.fields.options.value().slice(0, index),
												...createQuestion.fields.options.value().slice(index + 1)
											]
											createQuestion.fields.options.set(filtered)
										}}
									>
										<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
									</Button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<div class="form-block">
			<Subtitle>Settings</Subtitle>
			<div class="settings-toggles">
				<Input label="Status">
					<Select
						{...createQuestion.fields.status.as('select')}
						options={[
							{ label: 'Draft', value: 'draft' },
							{ label: 'Published', value: 'published' },
							{ label: 'Archived', value: 'archived' }
						]}
						onchange={(e) => {
							if (typeof e === 'string') {
								createQuestion.fields.status.set(e)
							}
						}}
					></Select>
				</Input>
				<Input label="Visibility" layout="horizontal" subgrid>
					<Checkbox {...createQuestion.fields.visibility.as('checkbox')}></Checkbox>
				</Input>
				<Input label="Required" layout="horizontal" subgrid>
					<Checkbox {...createQuestion.fields.required.as('checkbox')}></Checkbox>
				</Input>
			</div>
			<div class="form-block">
				<ActionBar>
					{#snippet left()}
						<Subtitle>Conditionals</Subtitle>
					{/snippet}
					{#snippet right()}
						<Button
							type="button"
							onclick={() => {
								const existing = createQuestion.fields.conditionals.value() ?? []
								console.log(existing)
								createQuestion.fields.conditionals.set([
									...existing,
									{ action: '', operator: '', question: '', value: '' }
								])
							}}><Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon></Button
						>
					{/snippet}
				</ActionBar>
				<div class="form-block">
					{#each createQuestion.fields.conditionals.value() as conditional, index}
						<div class="conditional">
							<div class="conditional-header">
								<Paragraph>
									Conditional {index + 1}
								</Paragraph>
								<Button
									type="button"
									onclick={() => {
										const filtered = [
											...createQuestion.fields.conditionals.value().slice(0, index),
											...createQuestion.fields.conditionals.value().slice(index + 1)
										]
										createQuestion.fields.conditionals.set(filtered)
									}}><Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon></Button
								>
							</div>
							<Input label="Question">
								<Select
									{...createQuestion.fields.conditionals[index].question.as(
										'select',
										conditional?.question
									)}
									options={questions.map((question) => ({
										label: question.question,
										value: String(question.id)
									}))}
									onchange={(e) => {
										if (typeof e === 'string') {
											createQuestion.fields.conditionals[index].question.set(e)
										}
									}}
								></Select>
							</Input>
							<Input label="Operator">
								<Select
									{...createQuestion.fields.conditionals[index].operator.as(
										'select',
										conditional?.operator
									)}
									onchange={(e) => {
										if (typeof e === 'string') {
											createQuestion.fields.conditionals[index].operator.set(e)
										}
									}}
									options={[
										{ label: 'Equal', value: 'equal' },
										{ label: 'Not equal', value: 'not_equal' },
										{ label: 'Includes', value: 'includes' }
									]}
								></Select>
							</Input>
							<Input label="Value">
								<Text
									{...createQuestion.fields.conditionals[index].value.as('text', conditional.value)}
								></Text>
							</Input>
							<Input label="Action">
								<Select
									{...createQuestion.fields.conditionals[index].action.as('select multiple')}
									options={[
										{ label: 'Visible', value: 'visible' },
										{ label: 'Hidden', value: 'hidden' },
										{ label: 'Required', value: 'required' }
									]}
									onchange={(e) => {
										console.log(typeof e)
										console.log(e)
										createQuestion.fields.conditionals[index].action.set(e)
									}}
								></Select>
							</Input>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="buttons">
			<Button
				type="reset"
				onclick={() => {
					toggleDialog(`add-question`)
				}}>Cancel</Button
			>
			<Button type="submit">Save</Button>
		</div>
	</form>
</Dialog>

<style>
	.questions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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
	.buttons {
		display: flex;
		gap: 0.25rem;
		justify-content: space-between;
	}
	.option {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	.form-block {
		display: flex;
		gap: 1rem;
		flex-direction: column;
	}
	.conditional-header {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		align-items: center;
	}
</style>
