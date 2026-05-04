<script lang="ts">
	import { enhance } from '$app/forms'
	import { handleEnhance } from '$lib/utils/forms'
	import { BaseSection, Button, Input, Subtitle, Text } from '@imago/ui'
</script>

<BaseSection>
	<form method="post" action="?/initialise" use:enhance={handleEnhance()}>
		<header>
			<Subtitle size="lg">Welcome</Subtitle>
			<Subtitle>Please create a super user account to initialise the application</Subtitle>
		</header>
		<div class="fields">
			<Input label="First name">
				<Text name="first_name"></Text>
			</Input>
			<Input label="Last name">
				<Text name="last_name"></Text>
			</Input>
			<Input label="Email">
				<Text name="email" type="email"></Text>
			</Input>
			<Input label="Password">
				<Text name="password" type="password"></Text>
			</Input>
			<Input label="Confirm password">
				<Text name="confirm_password" type="password"></Text>
			</Input>
		</div>
		<div class="buttons">
			<Button>Initialise application</Button>
		</div>
	</form>
</BaseSection>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.fields {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
