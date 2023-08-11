<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client'

	import type { PageData } from './$types'
	export let data: PageData

	const { form, errors, enhance, submitting } = superForm(data.form, {
		defaultValidator: 'clear'
	})
</script>

<div class="flex h-full w-full items-center justify-center">
	<form
		class="flex w-96 flex-col rounded-lg bg-base-300 p-4 [&>label]:mt-4"
		method="POST"
		use:enhance
	>
		<label class="label" for="email" class:text-error={!!$errors.email}> Email </label>
		<input
			class="input input-bordered focus:border-none"
			type="email"
			name="email"
			class:input-error={!!$errors.email}
			aria-invalid={!!$errors.email}
			bind:value={$form.email}
		/>
		{#if $errors.email}
			<small class="text-error">{$errors.email}</small>
		{/if}

		<label class="label" for="password">Password</label>
		<input
			class="input input-bordered focus:border-none"
			type="password"
			name="password"
			class:input-error={!!$errors.password}
			aria-invalid={!!$errors.password}
			bind:value={$form.password}
		/>
		{#if $errors.password}
			<small class="text-error">{$errors.password}</small>
		{/if}

		{#if $errors._errors}
			<p class="mt-6 text-center font-semibold text-error">{$errors._errors[0]}</p>
		{/if}

		<button type="submit" class="btn mt-6 hover:border-2 hover:border-[--b2]">
			{#if $submitting}
				<div class="loading loading-spinner bg-base-content" />
			{:else}
				Submit
			{/if}
		</button>
	</form>
</div>
