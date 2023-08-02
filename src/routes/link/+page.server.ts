import { isPlaidError, plaid } from '$lib/plaid'
import { CountryCode, Products } from 'plaid'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async () => {
	try {
		const { data } = await plaid.linkTokenCreate({
			user: { client_user_id: 'dmitriy_kagno' },
			client_name: 'Link Quick start',
			country_codes: [CountryCode.Us],
			language: 'en',
			products: [Products.Assets]
		})

		return {
			link_token: data.link_token
		}
	} catch (e) {
		if (isPlaidError(e)) {
			console.log(e.response?.data.error_type, e.response?.data.error_message)
			throw error(501)
		}

		throw error(500)
	}
}
