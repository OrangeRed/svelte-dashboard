<script lang="ts">
	import { onMount } from 'svelte'

	import type { RequestSchema } from '../../routes/_/token/+server'
	import type { Plaid } from 'plaid-link'

	export let text: string
	export let link_token: string

	let plaidLink: Plaid.LinkHandler

	onMount(async () => {
		plaidLink = window.Plaid.create({
			token: link_token,
			onSuccess: async (public_token, metadata) => {
				if (!metadata.institution) {
					console.log('Unknown institution')
					return
				}

				const payload = {
					public_token,
					account_ids: metadata.accounts.map((account) => account.id),
					institution: metadata.institution
				}

				console.log(payload, metadata, public_token)

				await fetch('/_/token', {
					method: 'POST',
					body: JSON.stringify(payload satisfies RequestSchema),
					headers: {
						'Content-Type': 'application/json'
					}
				})
			}
		})
	})
</script>

<svelte:head>
	<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>
</svelte:head>

<button class="btn btn-primary" on:click={() => plaidLink.open()}>{text}</button>
