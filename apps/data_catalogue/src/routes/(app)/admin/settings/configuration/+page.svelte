<script lang="ts">
	import {
		configurationAddSuperUser,
		configurationRemoveSuperUser,
		configurationSetStorage
	} from '$lib/remotes/configuration/update.remote.js'
	import { userServiceCreateUserApiToken } from '$lib/remotes/users/create.remote.js'
	import { userServiceDeleteUserApiToken } from '$lib/remotes/users/delete.remote.js'
	import { usersSearch } from '$lib/remotes/users/get.remote.js'
	import { notify } from '$lib/stores/notify.js'
	import CardUser from '$lib/ui/cards/card_user.svelte'
	import Dialog from '$lib/ui/cards/dialog.svelte'
	import { toggleDialog } from '$lib/utils/ui/index.js'
	import {
		BaseCard,
		BaseSection,
		Button,
		Icon,
		Input,
		Notice,
		Paragraph,
		Select,
		Subtitle,
		Text
	} from '@imago/ui'

	let { data } = $props()
	let users: { first_name: string; last_name: string; email: string; id: string }[] = $state([])
</script>

<div class="page">
	<BaseSection title="Add superuser" style="title">
		<div class="content">
			<form
				class="search-bar"
				{...usersSearch.enhance(async ({ submit }) => {
					const valid = await submit()
					if (valid && usersSearch.result) {
						users = usersSearch.result
					}
				})}
			>
				<Input label="Term">
					<Text {...usersSearch.fields.term.as('text')}></Text>
				</Input>
				<Button>Search</Button>
			</form>
			<div class="search-results">
				{#each users.filter((x) => !data.configuration.superusers?.includes(x.id)) as user}
					{@const form = configurationAddSuperUser.for(user.id)}
					<CardUser {user}>
						<form
							{...form.enhance(async ({ submit }) => {
								if (data.configuration.superusers?.includes(user.id)) {
									notify.send({ message: 'This user is already a superuser' })
									return
								}
								const valid = await submit()
								if (valid) {
									notify.send({ message: 'Success' })
								}
							})}
						>
							<input {...form.fields.id.as('hidden', user.id)} />
							<Button>
								<Icon icon={{ icon: 'plus', set: 'tabler' }}></Icon>
							</Button>
						</form>
					</CardUser>
				{/each}
			</div>
		</div>
	</BaseSection>
	<BaseSection style="title" title="Existing superusers">
		<div class="cards">
			{#each data.superusers as user}
				{@const form = configurationRemoveSuperUser.for(user.id)}
				<CardUser {user}>
					<Button
						onclick={() => {
							toggleDialog(`remove-${user.id}`)
						}}
					>
						<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
					</Button>
					<Dialog id="remove-{user.id}">
						<form
							{...form.enhance(async ({ submit }) => {
								const valid = await submit()
								if (valid) {
									notify.send({ message: 'Success' })
									toggleDialog(`remove-${user.id}`)
								}
							})}
						>
							<input {...form.fields.id.as('hidden', user.id)} />
							<Subtitle size="sm"
								>Are you sure you want to remove {user.first_name}
								{user.last_name} as superuser?</Subtitle
							>
							<div class="buttons">
								<Button
									type="button"
									onclick={() => {
										toggleDialog(`remove-${user.id}`)
									}}
								>
									Cancel
								</Button>
								<Button>Remove</Button>
							</div>
						</form>
					</Dialog>
				</CardUser>
			{/each}
		</div>
	</BaseSection>
	<BaseSection style="title" title="API Keys">
		<div class="content">
			{#if userServiceCreateUserApiToken.result}
				<Notice level="info">
					<div class="notice">
						<Subtitle size="xs">Copy this token as it will only appear once</Subtitle>
						<Button
							style="clean"
							onclick={() => {
								if (userServiceCreateUserApiToken.result) {
									window.navigator.clipboard.writeText(userServiceCreateUserApiToken.result.token)
									notify.send({ message: 'Token copied to clipboard' })
								}
							}}
						>
							<div class="button-content">
								<div class="copy-icon">
									<Icon icon={{ icon: 'copy', set: 'tabler' }}></Icon>
								</div>
								<p>
									{userServiceCreateUserApiToken.result.token}
								</p>
							</div>
						</Button>
					</div>
				</Notice>
			{/if}
			<form class="form" {...userServiceCreateUserApiToken}>
				<input {...userServiceCreateUserApiToken.fields.id.as('hidden', data.ckan_users[0].id)} />

				<Input label="Token name" required>
					{#snippet message()}
						{#each userServiceCreateUserApiToken.fields.name.issues() as issue}
							<Paragraph size="xs">{issue.message}</Paragraph>
						{/each}
					{/snippet}
					<Text required {...userServiceCreateUserApiToken.fields.name.as('text')}></Text>
				</Input>
				<Button>Create</Button>
			</form>
			<div class="cards">
				{#each data.api_keys as key_record}
					{@const form = userServiceDeleteUserApiToken.for(key_record.id)}
					<BaseCard overflow border rounded>
						<div class="token-card">
							<div class="section">
								<div class="section-title">
									<Subtitle>Name: {key_record.name}</Subtitle>
									<div class="buttons">
										<Button
											onclick={() => {
												toggleDialog(`delete-token-${key_record.id}`)
											}}
										>
											<Icon icon={{ icon: 'trash', set: 'tabler' }}></Icon>
										</Button>
										<Dialog id="delete-token-{key_record.id}">
											<Subtitle>Are you sure you want to revoke this token?</Subtitle>
											<form
												{...form.enhance(async ({ submit }) => {
													const valid = await submit()
													if (valid) {
														notify.send({ message: `Token deleted` })
														toggleDialog(`delete-token-${key_record.id}`)
													}
												})}
											>
												<input {...form.fields.id.as('hidden', key_record.id)} />
												<div class="buttons">
													<Button
														type="button"
														onclick={() => {
															toggleDialog(`delete-token-${key_record.id}`)
														}}>Cancel</Button
													>
													<Button>Revoke</Button>
												</div>
											</form>
										</Dialog>
									</div>
								</div>
								<div class="card-information">
									<Paragraph size="xs">Created at: {key_record.created_at}</Paragraph>
									<Paragraph size="xs">Last access at: {key_record.last_access}</Paragraph>
								</div>
							</div>
						</div></BaseCard
					>
				{/each}
			</div>
		</div>
		<!-- <pre>{jstr(data.api_keys)}</pre> -->
	</BaseSection>
	<BaseSection style="title" title="Storage configuration">
		<div class="section">
			<div class="content">
				<form
					{...configurationSetStorage.for('resources_storage').enhance(async ({ submit }) => {
						const valid = await submit()
						if (valid) {
							notify.send({ message: 'Resources storage updated' })
						}
					})}
				>
					<div class="inputs">
						<Subtitle>Resources storage</Subtitle>
					</div>
					<input type="hidden" value="resources_storage" name="kind" />
					<Select
						name="id"
						value={data.configuration.resources_storage ?? undefined}
						options={data.storages.items.map((storage) => ({
							label: storage.name,
							value: storage.id
						}))}
						onchange={async () => {
							const valid = await configurationSetStorage.for('resources_storage').submit()
							if (valid) {
								notify.send({ message: 'Resources storage updated' })
							}
						}}
					></Select>
				</form>
				<form
					{...configurationSetStorage.for('products_storage').enhance(async ({ submit }) => {
						const valid = await submit()
						if (valid) {
							notify.send({ message: 'Products storage updated' })
						}
					})}
				>
					<div class="inputs">
						<Subtitle>Products storage</Subtitle>
					</div>
					<input type="hidden" value="products_storage" name="kind" />
					<Select
						name="id"
						value={data.configuration.products_storage ?? undefined}
						options={data.storages.items.map((storage) => ({
							label: storage.name,
							value: storage.id
						}))}
						onchange={async () => {
							const valid = await configurationSetStorage.for('products_storage').submit()
							if (valid) {
								notify.send({ message: 'Products storage updated' })
							}
						}}
					></Select>
				</form>
				<form
					{...configurationSetStorage.for('geographies_storage').enhance(async ({ submit }) => {
						const valid = await submit()
						if (valid) {
							notify.send({ message: 'Geographies storage updated' })
						}
					})}
				>
					<div class="inputs">
						<Subtitle>Geographies storage</Subtitle>
					</div>
					<input type="hidden" value="geographies_storage" name="kind" />
					<Select
						name="id"
						value={data.configuration.geographies_storage ?? undefined}
						options={data.storages.items.map((storage) => ({
							label: storage.name,
							value: storage.id
						}))}
						onchange={async () => {
							const valid = await configurationSetStorage.for('geographies_storage').submit()
							if (valid) {
								notify.send({ message: 'Products storage updated' })
							}
						}}
					></Select>
				</form>
				<form
					{...configurationSetStorage.for('tiles_storage').enhance(async ({ submit }) => {
						const valid = await submit()
						if (valid) {
							notify.send({ message: 'Tiles storage updated' })
						}
					})}
				>
					<div class="inputs">
						<Subtitle>Tiles storage</Subtitle>
					</div>
					<input type="hidden" value="tiles_storage" name="kind" />
					<Select
						name="id"
						value={data.configuration.tiles_storage ?? undefined}
						options={data.storages.items.map((storage) => ({
							label: storage.name,
							value: storage.id
						}))}
						onchange={async () => {
							const valid = await configurationSetStorage.for('tiles_storage').submit()
							if (valid) {
								notify.send({ message: 'Products storage updated' })
							}
						}}
					></Select>
				</form>
			</div>
		</div>
	</BaseSection>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.search-bar {
		display: flex;
		gap: 0.5rem;
		align-items: flex-end;
	}
	.search-results {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.cards {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.buttons {
		display: flex;
		gap: 0.25rem;
		justify-content: space-between;
	}
	.content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.notice {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 0;
	}
	.button-content {
		display: flex;
		text-align: left;
		align-items: center;
		gap: 1rem;
		width: 100%;
		text-wrap: wrap;
		word-break: break-all;
		font-size: 0.85rem;
	}
	.token-card {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section {
		display: grid;
		grid-template-rows: minmax(0, 1fr) minmax(0, max-content);
		gap: 0.25rem;
	}
	.section-title {
		display: flex;
		justify-content: space-between;
	}
	.card-information {
		display: flex;
		flex-direction: column;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}
</style>
