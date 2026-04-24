<script lang="ts">
	import { applyAction, enhance } from '$app/forms'
	import { page } from '$app/state'
	import { notify } from '$lib/stores/notify'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import FileInput from '$lib/ui/inputs/file_input.svelte'
	import { Button, Input, Paragraph, Select, Subtitle, Text, Title } from '@imago/ui'
	let { data, children } = $props()
	const toggleDialog = (id: string) => {
		const dialog = document.getElementById(id) as HTMLDialogElement | null
		if (dialog) {
			if (!dialog.open) {
				dialog.showModal()
				return
			}
			dialog.close()
		}
	}
	let manual_form_required = $state(true)
</script>

<div class="dataset-layout">
	{#if !page.params.id}
		<nav>
			{#if data.allow_create}
				<Button
					onclick={() => {
						toggleDialog('datasets-dialog')
					}}>Create</Button
				>
			{/if}
		</nav>
	{/if}
	<div class="dataset">
		{@render children()}
	</div>
</div>
<Dialog id="datasets-dialog">
	<div class="dialog">
		<Title>Create dataset</Title>
		<form
			action="?/create"
			method="post"
			enctype="multipart/form-data"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'redirect') {
						notify.send(`Dataset successfully created`)
					}
					if ('data' in result) {
						notify.send(String(result.data?.message))
						return
					}
					applyAction(result)
					toggleDialog('datasets-dialog')
				}
			}}
		>
			<div class="fields">
				<div class="fields-block">
					<Subtitle>Create manually</Subtitle>
					<Input required={manual_form_required} label="Title">
						<Text name="title"></Text>
					</Input>
					{#if Array.isArray(data.groups)}
						<Input required={manual_form_required} label="Group">
							<Select
								name="group"
								options={data.groups.map((result) => ({
									label: typeof result === 'string' ? result : result.title,
									value: typeof result === 'string' ? result : result.name
									// value: JSON.stringify({ id: result.id, name: result.name })
								}))}
							></Select>
						</Input>
					{/if}
				</div>
				<Paragraph align="centre">or</Paragraph>
				<div class="fields-block">
					<Subtitle>Upload a metadata JSON file</Subtitle>
					<FileInput
						label="Metadata file"
						name="file"
						enable_previews={false}
						onchange={(e) => {
							if (e.currentTarget.files && e.currentTarget.files.length > 0) {
								manual_form_required = false
								return
							}
							manual_form_required = true
						}}
						ondrop={(e) => {
							if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
								manual_form_required = false
								return
							}
							manual_form_required = true
						}}
					></FileInput>
				</div>
			</div>
			<div class="buttons">
				<Button
					type="button"
					onclick={() => {
						toggleDialog('datasets-dialog')
					}}>Cancel</Button
				>
				<Button>Create</Button>
			</div>
		</form>
	</div>
</Dialog>

<style>
	nav {
		width: min(100lvw - 4rem, 1440px);
		margin-inline: auto;
		display: flex;
		justify-content: flex-end;
		padding: 1rem 2rem;
		gap: 1rem;
	}
	form {
		/* padding: 1rem; */
		display: grid;
		grid-auto-flow: row;
		gap: 1rem;
		width: 100%;
		overflow: hidden;
	}
	.buttons {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.dialog {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.fields {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.fields-block {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1rem;
		background-color: var(--background-muted);
		border-radius: var(--radius);
	}
</style>
