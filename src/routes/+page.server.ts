import { error } from '@sveltejs/kit'
import { Collections, type AccessTokensResponse } from '$lib/pocketbase'
import { plaid, isPlaidError } from '$lib/plaid'
import {
	Products,
	type AccountBase,
	type Holding,
	type Security,
	type CreditCardLiability,
	type InvestmentsHoldingsGetResponse,
	type LiabilitiesGetResponse,
	type Transaction
} from 'plaid'

import type { PageServerLoad } from './$types'

type InvestmentAccount = AccountBase & {
	holdings: (Holding & {
		name?: Security['name']
		ticker_symbol?: Security['ticker_symbol']
	})[]
}

type CreditCardAccount = AccountBase &
	Partial<CreditCardLiability> & {
		transactions: Transaction[]
	}

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const tokens = await locals.pb
			.collection(Collections.AccessTokens)
			.getFullList<AccessTokensResponse<Products[]>>()

		const institutions = await Promise.all(
			tokens.map(async ({ access_token, institution_name, enabled_products }) => {
				let data: Partial<InvestmentsHoldingsGetResponse & LiabilitiesGetResponse> = {}
				const institutionAccounts: {
					credit?: CreditCardAccount[]
					investments?: InvestmentAccount[]
				} = {}

				const { data: transactions } = await plaid.transactionsSync({ access_token })

				if (enabled_products?.includes(Products.Investments)) {
					const {
						data: { accounts, holdings, securities }
					} = await plaid.investmentsHoldingsGet({ access_token })

					const securitiesMap = securities.reduce(
						(hashMap, security) => hashMap.set(security.security_id, security),
						new Map<string, Security>()
					)

					const holdingsMap = holdings.reduce((hashMap, holding) => {
						const security = securitiesMap.get(holding.security_id)

						const updatedHolding = Object.assign(holding, {
							name: security?.name,
							ticker_symbol: security?.ticker_symbol
						})

						const accountHoldings = hashMap.get(holding.account_id) ?? []

						accountHoldings.push(updatedHolding)

						return hashMap.set(holding.account_id, accountHoldings)
					}, new Map<string, InvestmentAccount['holdings']>())

					const investments = accounts
						.filter((account) => {
							if (account.type === 'brokerage' || account.type === 'investment') {
								// totals.investments += account.balances.current ?? 0
								return true
							}
						})
						.map((account) =>
							Object.assign(account, { holdings: holdingsMap.get(account.account_id) ?? [] })
						)

					institutionAccounts.investments = investments
				}

				if (enabled_products?.includes(Products.Liabilities)) {
					const {
						data: { liabilities, accounts }
					} = await plaid.liabilitiesGet({ access_token })

					const credit = accounts
						.filter((account) => account.type === 'credit')
						.map((account) => {
							return Object.assign(account, {
								...liabilities.credit?.find(
									(creditCard) => creditCard.account_id === account.account_id
								),
								transactions: transactions.added.filter(
									(transaction) => transaction.account_id === account.account_id
								)
							})
						})

					institutionAccounts.credit = credit
				}

				return Object.assign(data, {
					flattened: institutionAccounts,
					transactions: transactions.added,
					nextTransactions: transactions.next_cursor,
					hasMoreTransactions: transactions.has_more
				})
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

		const allSecurities = institutions.reduce((securities, curr) => {
			if (!curr.securities) {
				return securities
			}

			for (const security of curr.securities) {
				securities.set(security.security_id, security)
			}

			return securities
		}, new Map<string, Security>())

		const allCreditAccounts = institutions
			.map((institution) => institution.flattened.credit ?? [])
			.flat()

		const allInvestmentAccounts = institutions
			.map((institution) => institution.flattened.investments ?? [])
			.flat()

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
