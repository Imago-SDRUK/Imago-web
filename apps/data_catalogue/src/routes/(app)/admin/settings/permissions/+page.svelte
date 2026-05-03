<script lang="ts">
	import { enhance } from '$app/forms'
	import CardBlock from '$lib/ui/cards/card_block.svelte'
	import { handleEnhance } from '$lib/utils/forms/index.js'
	import { jstr } from '@arturoguzman/art-ui'
	import {
		ActionBar,
		BaseCard,
		BaseSection,
		Button,
		Input,
		Paragraph,
		Select,
		Subtitle,
		Text
	} from '@imago/ui'

	let { data } = $props()

	const options = [
		'Answer',
		'Question',
		'ResourceVersion',
		'Resource',
		'Dataset',
		'Action',
		'Group',
		'User'
	]
	let actor_type = $state('')
	let actor = $state('')
	let actor_set = $state({ namespace: '', object: '', relation: '' })
</script>

<BaseSection>
	<div class="section">
		<div class="left-col">
			<div class="cards">
				<CardBlock>
					{#snippet header()}
						<Subtitle>Actions</Subtitle>
					{/snippet}
					{#snippet content()}
						{#each data.permissions.relation_tuples as permission (permission)}
							<BaseCard border>
								<form class="card" method="post" action="?/delete" use:enhance={handleEnhance()}>
									<input type="hidden" value={permission.namespace} name="namespace" />
									<input type="hidden" value={permission.object} name="object" />
									<input type="hidden" value={permission.relation} name="relation" />
									<input
										type="hidden"
										value={JSON.stringify(permission.subject_id ?? permission.subject_set)}
										name="actor"
									/>
									<Paragraph>Namespace: {permission.namespace}</Paragraph>
									<Paragraph>Object: {permission.object}</Paragraph>
									<Paragraph>Relation: {permission.relation}</Paragraph>
									{#if permission.subject_set}
										<Paragraph>Subject namespace: {permission.subject_set.namespace}</Paragraph>
										<Paragraph>Subject object: {permission.subject_set.object}</Paragraph>
										<Paragraph>Subject relation: {permission.subject_set.relation}</Paragraph>
									{:else}
										<Paragraph>Subject: {permission.subject_id}</Paragraph>
									{/if}
									<Button>Delete</Button>
								</form>
							</BaseCard>
						{/each}
					{/snippet}
				</CardBlock>
				<CardBlock>
					{#snippet header()}
						<ActionBar>
							{#snippet left()}
								<Subtitle>Dataset</Subtitle>
							{/snippet}
							{#snippet right()}
								<form action="?/reset" method="post" use:enhance={handleEnhance()}>
									<input type="hidden" value="Dataset" name="namespace" />
									<Button>Reset</Button>
								</form>
							{/snippet}
						</ActionBar>
					{/snippet}
					{#snippet content()}
						{#each data.dataset_permissions.relation_tuples as permission (permission)}
							<BaseCard border>
								<form class="card" method="post" action="?/delete" use:enhance={handleEnhance()}>
									<input type="hidden" value={permission.namespace} name="namespace" />
									<input type="hidden" value={permission.object} name="object" />
									<input type="hidden" value={permission.relation} name="relation" />
									<input
										type="hidden"
										value={JSON.stringify(permission.subject_id ?? permission.subject_set)}
										name="actor"
									/>
									<Paragraph>Namespace: {permission.namespace}</Paragraph>
									<Paragraph>Object: {permission.object}</Paragraph>
									<Paragraph>Relation: {permission.relation}</Paragraph>
									{#if permission.subject_set}
										<Paragraph>Subject namespace: {permission.subject_set.namespace}</Paragraph>
										<Paragraph>Subject object: {permission.subject_set.object}</Paragraph>
										<Paragraph>Subject relation: {permission.subject_set.relation}</Paragraph>
									{:else}
										<Paragraph>Subject: {permission.subject_id}</Paragraph>
									{/if}
									<Button>Delete</Button>
								</form>
							</BaseCard>
						{/each}
					{/snippet}
				</CardBlock>
				<CardBlock>
					{#snippet header()}
						<ActionBar>
							{#snippet left()}
								<Subtitle>Resources</Subtitle>
							{/snippet}
							{#snippet right()}
								<form action="?/reset" method="post" use:enhance={handleEnhance()}>
									<input type="hidden" value="Resource" name="namespace" />
									<Button>Reset</Button>
								</form>
							{/snippet}
						</ActionBar>
					{/snippet}
					{#snippet content()}
						{#each data.resources_permissions.relation_tuples as permission (permission)}
							<BaseCard border>
								<form class="card" method="post" action="?/delete" use:enhance={handleEnhance()}>
									<input type="hidden" value={permission.namespace} name="namespace" />
									<input type="hidden" value={permission.object} name="object" />
									<input type="hidden" value={permission.relation} name="relation" />
									<input
										type="hidden"
										value={JSON.stringify(permission.subject_id ?? permission.subject_set)}
										name="actor"
									/>
									<Paragraph>Namespace: {permission.namespace}</Paragraph>
									<Paragraph>Object: {permission.object}</Paragraph>
									<Paragraph>Relation: {permission.relation}</Paragraph>
									{#if permission.subject_set}
										<Paragraph>Subject namespace: {permission.subject_set.namespace}</Paragraph>
										<Paragraph>Subject object: {permission.subject_set.object}</Paragraph>
										<Paragraph>Subject relation: {permission.subject_set.relation}</Paragraph>
									{:else}
										<Paragraph>Subject: {permission.subject_id}</Paragraph>
									{/if}
									<Button>Delete</Button>
								</form>
							</BaseCard>
						{/each}
					{/snippet}
				</CardBlock>
				<CardBlock>
					{#snippet header()}
						<Subtitle>Groups</Subtitle>
					{/snippet}
					{#snippet content()}
						{#each data.group_permissions.relation_tuples as permission (permission)}
							<BaseCard border>
								<form class="card" method="post" action="?/delete" use:enhance={handleEnhance()}>
									<input type="hidden" value={permission.namespace} name="namespace" />
									<input type="hidden" value={permission.object} name="object" />
									<input type="hidden" value={permission.relation} name="relation" />
									<input
										type="hidden"
										value={JSON.stringify(permission.subject_id ?? permission.subject_set)}
										name="actor"
									/>
									<Paragraph>Namespace: {permission.namespace}</Paragraph>
									<Paragraph>Object: {permission.object}</Paragraph>
									<Paragraph>Relation: {permission.relation}</Paragraph>
									{#if permission.subject_set}
										<Paragraph>Subject namespace: {permission.subject_set.namespace}</Paragraph>
										<Paragraph>Subject object: {permission.subject_set.object}</Paragraph>
										<Paragraph>Subject relation: {permission.subject_set.relation}</Paragraph>
									{:else}
										<Paragraph>Subject: {permission.subject_id}</Paragraph>
									{/if}
									<Button>Delete</Button>
								</form>
							</BaseCard>
						{/each}
					{/snippet}
				</CardBlock>
			</div>
		</div>
		<div class="right-col">
			<form action="?/create" method="POST" use:enhance={handleEnhance()}>
				<Input label="Namespace" required>
					<Select name="namespace" options={options.map((opt) => ({ label: opt, value: opt }))}
					></Select>
				</Input>
				<Input label="Object" required>
					<Text name="object"></Text>
				</Input>

				<Input label="Relation" required>
					<Text name="relation"></Text>
					<!-- <Select -->
					<!-- 	name="relation" -->
					<!-- 	options={[ -->
					<!-- 		{ label: 'Admins', value: 'admins' }, -->
					<!-- 		{ label: 'Owners', value: 'owners' }, -->
					<!-- 		{ label: 'Editors', value: 'editors' }, -->
					<!-- 		{ label: 'Viewers', value: 'viewers' } -->
					<!-- 	]} -->
					<!-- ></Select> -->
				</Input>
				<Select
					bind:value={actor_type}
					options={[
						{ label: 'Set', value: 'set' },
						{ label: 'Direct', value: 'direct' }
					]}
				></Select>
				{#if actor_type === 'set'}
					<input type="hidden" name="actor" value={JSON.stringify(actor_set)} />
					<Input label="Actor namespace">
						<Text bind:value={actor_set.namespace}></Text>
					</Input>
					<Input label="Actor object">
						<Text bind:value={actor_set.object} name="subject_set_object"></Text>
					</Input>
					<Input label="Actor relation">
						<Text bind:value={actor_set.relation} name="subject_set_relation"></Text>
					</Input>
				{/if}
				{#if actor_type === 'direct'}
					<Input label="Actor" required>
						<Text name="actor"></Text>
					</Input>
				{/if}
				<Button>Create</Button>
			</form>
		</div>
	</div>
</BaseSection>

<style>
	.cards {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
	}
	.section {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 2rem;
	}
</style>
