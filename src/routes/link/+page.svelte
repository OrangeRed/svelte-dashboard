<script lang="ts">
	import { onMount } from 'svelte'

	import type { RequestSchema } from './token/+server'
	import type { Plaid } from 'plaid-link'
	import type { PageData } from './$types'

	export let data: PageData

	let plaidHandler: Plaid.LinkHandler

	onMount(async () => {
		plaidHandler = window.Plaid.create({
			token: data.link_token,
			onSuccess: async (public_token, metadata) => {
				if (!metadata.institution) {
					console.log('No institution')
					return
				}

				const payload = {
					public_token,
					account_ids: metadata.accounts.map((account) => account.id),
					institution: metadata.institution
				}

				await fetch('/link/token', {
					method: 'POST',
					body: JSON.stringify(payload satisfies RequestSchema),
					headers: {
						'Content-Type': 'application/json'
					}
				})

				console.log(public_token, metadata)
			}
		})
	})
</script>

<svelte:head>
	<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
</svelte:head>

<div>Link token: {data.link_token}</div>

<button class="btn btn-primary" on:click={() => plaidHandler.open()}>Click me</button>
