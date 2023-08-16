import { error } from '@sveltejs/kit'

import { Collections, type AccessTokensResponse } from '$lib/pocketbase/types'
import { plaid, isPlaidError } from '$lib/plaid'
import {
	Products,
	type AccountBase,
	type Holding,
	type Security,
	type CreditCardLiability,
	type InvestmentsHoldingsGetResponse,
	type LiabilitiesGetResponse
} from 'plaid'

import type { PageServerLoad } from './$types'

type Investments = AccountBase & {
	holdings: (Holding & {
		name?: Security['name']
		ticker_symbol?: Security['ticker_symbol']
	})[]
}

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const tokens = await locals.pb
			.collection(Collections.AccessTokens)
			.getFullList<AccessTokensResponse>()

		const institutions = await Promise.all(
			tokens.map(async ({ access_token, institution_name }) => {
				let data: Partial<InvestmentsHoldingsGetResponse & LiabilitiesGetResponse> = {}

				const {
					data: { item }
				} = await plaid.itemGet({ access_token })

				console.log('Item:', institution_name, item.billed_products)

				if (item.billed_products.includes(Products.Investments)) {
					const { data: holdings } = await plaid.investmentsHoldingsGet({ access_token })

					data = Object.assign(data, holdings)
				}

				if (item.billed_products.includes(Products.Liabilities)) {
					const { data: liabilities } = await plaid.liabilitiesGet({ access_token })

					data = Object.assign(data, liabilities)
				}

				const { data: transactions } = await plaid.transactionsSync({ access_token })

				return Object.assign(data, {
					transactions: transactions.added,
					nextTransaction: transactions.next_cursor,
					hasMoreTransactions: transactions.has_more
				})

				// return data
			})
		)

		const totals = {
			cash: 0,
			investments: 0
		}

		const allCashAccounts = institutions.reduce((accounts, institution) => {
			const cashAccounts = institution.accounts?.filter((account) => {
				if (account.type === 'depository') {
					totals.cash += account.balances.current ?? 0
					return true
				}
			})

			return accounts.concat(cashAccounts ?? [])
		}, [] as AccountBase[])

		const allCreditAccounts = institutions.reduce(
			(accounts, institution) => {
				const creditAccounts = institution.accounts
					?.filter((account) => account.type === 'credit')
					?.map((account) => {
						return Object.assign(account, {
							...institution.liabilities?.credit?.find(
								(creditCard) => creditCard.account_id === account.account_id
							),
							transactions: institution.transactions.filter(
								(transaction) => transaction.account_id === account.account_id
							)
						})
					})

				return accounts.concat(creditAccounts ?? [])
			},
			[] as Array<AccountBase & Partial<CreditCardLiability>>
		)

		const allInvestmentAccounts = institutions.reduce((accounts, institution) => {
			const investmentAccounts = institution.accounts?.filter((account) => {
				if (account.type === 'brokerage' || account.type === 'investment') {
					totals.investments += account.balances.current ?? 0
					return true
				}
			})

			const investmentsWithHoldings = investmentAccounts?.map((account) => {
				const holdings =
					institution.holdings?.reduce(
						(holdings, curr) => {
							if (curr.account_id === account.account_id) {
								const security = institution.securities?.find(
									(security) => security.security_id === curr.security_id
								)

								holdings.push(
									Object.assign(curr, {
										name: security?.name,
										ticker_symbol: security?.ticker_symbol
									}) satisfies Investments['holdings'][0]
								)
							}

							return holdings
						},
						[] as Investments['holdings']
					) ?? []

				return Object.assign(account, { holdings }) satisfies Investments
			})

			return accounts.concat(investmentsWithHoldings ?? [])
		}, [] as Investments[])

		const allSecurities = institutions.reduce((securities, curr) => {
			if (!curr.securities) {
				return securities
			}

			for (const security of curr.securities) {
				securities.set(security.security_id, security)
			}

			return securities
		}, new Map<string, Security>())

		return {
			cash: allCashAccounts,
			credit: allCreditAccounts,
			investments: allInvestmentAccounts,
			securities: allSecurities,
			totals
		}
	} catch (e) {
		if (isPlaidError(e)) {
			console.log('Response: ', e.response)
			console.log('Data: ', e.response?.data)
		} else {
			console.log('Unknown Error: ', e)
		}

		throw error(500)
	}
}
