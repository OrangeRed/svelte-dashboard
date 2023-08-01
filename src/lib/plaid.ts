import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV } from '$env/static/private'

import { AxiosError, isAxiosError } from 'axios'
import { Configuration, PlaidApi, PlaidEnvironments, type PlaidError } from 'plaid'

const configuration = new Configuration({
	basePath: PlaidEnvironments[PLAID_ENV],
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': PLAID_SECRET
		}
	}
})

export const plaid = new PlaidApi(configuration)

export const isPlaidError = <D = any>(e: unknown): e is AxiosError<PlaidError, D> => {
	return isAxiosError<PlaidError, D>(e)
}