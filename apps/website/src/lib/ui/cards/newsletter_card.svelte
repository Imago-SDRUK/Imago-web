<script lang="ts">
	import { enhance } from '$app/forms'
	import { notify } from '$lib/stores/notify'
	import { BaseCard, Title, Paragraph, Input, Text, Button } from '@imago/ui'
	let {
		title = 'Newsletter',
		paragraph = 'Subscribe to the newsletter to keep updated on Imago news and data products.'
	}: { title?: string; paragraph?: string } = $props()
</script>

<BaseCard border rounded shadow size="md">
	<div id="newsletter-form" class="newsletter-form">
		<div class="title">
			<Title text={title} size="lg"></Title>
			<Paragraph text={paragraph}></Paragraph>
		</div>
		<form
			class="form-content"
			method="POST"
			action="/?/newsletter"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'failure') notify.send({ message: String(result.data?.message) })
					if (result.type === 'error')
						notify.send({
							message: `There's been an error submitting this request, please try again`
						})
					if (result.type === 'success') {
						notify.send({ message: `Thank you, you've been successfully added to the newsletter` })
						update({ reset: true, invalidateAll: true })
					}
				}
			}}
		>
			<Input label="Name">
				<Text aria-label="name" name="name"></Text>
			</Input>
			<Input label="Email">
				<Text aria-label="email" type="email" name="email"></Text>
			</Input>
			<div class="button-container">
				<Button
					>{#snippet leftCol()}
						<p>Subscribe</p>
					{/snippet}</Button
				>
			</div>
		</form>
	</div>
</BaseCard>

<style>
	.form-content {
		display: grid;
		gap: 0.5rem;
		background-color: var(--background);
	}
	.button-container {
		display: flex;
		justify-content: flex-end;
	}
	.newsletter-form {
		padding: 2rem;
		/* width: min(100% - 1rem, 400px); */
		margin-inline: auto;
		/* border: 1px solid var(--theme-colour-text); */
		/* padding: 2rem; */
		/* border-radius: 1rem; */
		/* box-shadow: var(--glass); */
		/* border: 1px solid var(--theme-colour-quarternary); */
		background-color: var(--background);
	}
	.form-content {
		padding: 1rem 0;
		background-color: var(--background);
	}
</style>
