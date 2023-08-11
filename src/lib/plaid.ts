import { PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV } from '$env/static/private'

import { AxiosError, isAxiosError } from 'axios'
import {
	Configuration,
	PlaidApi,
	PlaidEnvironments,
	type PlaidErrorType,
	type PlaidError
} from 'plaid'

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

// Remove `{ [key: string]: unknown }` from inside of a type
type RemoveIndex<T> = {
	[K in keyof T as K extends `${infer K}` ? K : never]: T[K]
}

// Replace error_type enum with union type for completions
type betterPlaidError = Omit<RemoveIndex<PlaidError>, 'error_type'> & {
	[key: string]: unknown
	error_type: `${PlaidErrorType}`
}

export function isPlaidError<D = any>(e: unknown): e is AxiosError<betterPlaidError, D> {
	return isAxiosError<PlaidError, D>(e)
}
