import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { Collections, type AccessTokensResponse } from '$lib/pocketbase'
import { CountryCode, Products, type LinkTokenCreateRequest } from 'plaid'
import { isPlaidError, plaid } from '$lib/plaid'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid || !locals.pb.authStore.model) {
		throw redirect(303, '/_/login')
	}

	try {
		const institutions = await locals.pb
			.collection(Collections.AccessTokens)
			.getFullList<AccessTokensResponse>()

		const baseLinkConfig: LinkTokenCreateRequest = {
			user: { client_user_id: locals.pb.authStore.model.id },
			client_name: 'OrangeRed Dashboard',
			country_codes: [CountryCode.Us],
			language: 'en',
			products: [Products.Transactions],
			required_if_supported_products: [Products.Liabilities, Products.Investments]
		}

		async function newLinkToken() {
			const { data } = await plaid.linkTokenCreate(baseLinkConfig)

			return data.link_token
		}

		return {
			newToken: newLinkToken(),
			existingTokens: Promise.all(
				institutions.map(async ({ access_token, institution_name }) => {
					const { data } = await plaid.linkTokenCreate({
						...baseLinkConfig,
						products: undefined,
						access_token,
						update: { account_selection_enabled: true }
					})

					return {
						link_token: data.link_token,
						name: institution_name
					}
				})
			)
		}
	} catch (e) {
		if (isPlaidError(e)) {
			console.log(e.response?.data)
		}

		throw error(500)
	}
}
