<script lang="ts">
	import PlaidLink from '$lib/components/PlaidLink.svelte'

	import type { PageData } from './$types'

	export let data: PageData
	const { existingTokens, newToken } = data
</script>

<div class="mx-4 flex gap-4">
	<PlaidLink link_token={newToken} text="Add Account" />

	{#each existingTokens as { link_token, name }}
		<PlaidLink {link_token} text={`Update ${name}`} />
	{/each}
</div>
