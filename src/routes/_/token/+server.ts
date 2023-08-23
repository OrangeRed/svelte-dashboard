import { z, ZodError } from 'zod'
import { error, redirect } from '@sveltejs/kit'

import { isPlaidError, plaid } from '$lib/plaid'
import { Collections, type AccessTokensRecord } from '$lib/pocketbase'
import { where } from '$lib/pocketbase/utils'

import type { RequestHandler } from './$types'
import type { Products } from 'plaid'

export type RequestSchema = z.infer<typeof requestSchema>

const requestSchema = z.object({
	public_token: z.string(),
	account_ids: z.array(z.string()),
	institution: z.object({
		name: z.string(),
		institution_id: z.string()
	})
})

export const POST: RequestHandler = async ({ locals, request }) => {
	try {
		const data = await request.json()
		const { public_token, institution, account_ids } = requestSchema.parse(data)

		const record = await locals.pb
			.collection(Collections.AccessTokens)
			.getFirstListItem(
				where<AccessTokensRecord>(['institution_id', '=', institution.institution_id])
			)
			.catch(() => null) // Don't throw if the record doesn't exist

		if (!record) {
			const {
				data: { access_token }
			} = await plaid.itemPublicTokenExchange({ public_token })

			const {
				data: { item }
			} = await plaid.itemGet({ access_token })

			await locals.pb.collection(Collections.AccessTokens).create({
				access_token: access_token,
				institution_id: institution.institution_id,
				institution_name: institution.name,
				enabled_products: item.billed_products
			} satisfies AccessTokensRecord<Products[]>)
		} else {
			console.log('Record Exists', data)
		}
	} catch (e) {
		if (e instanceof ZodError) {
			console.log('Validation Failed: ', e)
			throw error(500)
		}

		if (isPlaidError(e)) {
			console.log('Plaid Error: ', e.response?.data)
			throw error(500)
		}

		console.log(e)
		throw error(500)
	}

	return new Response('success')
}
