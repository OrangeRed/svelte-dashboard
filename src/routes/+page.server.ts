import { PLAID_ACCESS_TOKEN } from '$env/static/private'
import { error } from '@sveltejs/kit'

import { plaid, isPlaidError } from '$lib/plaid'
import { Products, type AccountBase, type Holding, type AccountType, type Security } from 'plaid'

import type { PageServerLoad } from './$types'

type Investments = AccountBase & {
	holdings: (Holding & {
		name: Security['name']
		ticker_symbol: Security['ticker_symbol']
	})[]
}

export const load: PageServerLoad = async () => {
	let access_token = PLAID_ACCESS_TOKEN

	try {
		if (!access_token) {
			const {
				data: { public_token }
			} = await plaid.sandboxPublicTokenCreate({
				institution_id: 'ins_109509', // https://plaid.com/docs/sandbox/institutions/
				initial_products: [Products.Investments]
			})

			const { data } = await plaid.itemPublicTokenExchange({ public_token })
			access_token = data.access_token
		}

		const res = await plaid.investmentsHoldingsGet({ access_token })

		const totals = {
			cash: 0,
			investments: 0
		}

		res.data.accounts.map((account) => {
			const accountType = account.type as `${AccountType}`
			if (accountType === 'depository') {
				totals.cash += account.balances.current ?? 0
			}

			if (accountType === 'brokerage' || accountType === 'investment') {
				totals.investments += account.balances.current ?? 0
			}
		})

		const investments = res.data.accounts
			.filter((account) => account.type === 'investment')
			.map((account) => {
				account.holdings = res.data.holdings
					.filter((holding) => holding.account_id === account.account_id)
					.map((holding) => {
						const security = res.data.securities.find(
							(security) => security.security_id === holding.security_id
						)

						holding.name = security?.name
						holding.ticker_symbol = security?.ticker_symbol

						return holding
					})

				return account
			}) as Investments[]

		return {
			cash: res.data.accounts.filter((account) => account.type === 'depository'),
			credit: res.data.accounts.filter((account) => account.type === 'credit'),
			investments,
			securities: res.data.securities,
			totals
		}
	} catch (e) {
		if (isPlaidError(e) && e.response) {
			console.log(e.response?.data)
		} else {
			console.log('Unknown Error: ', e)
		}

		throw error(500)
	}
}
