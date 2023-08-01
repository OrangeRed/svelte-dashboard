import { z, ZodError } from 'zod'

import type { RequestHandler } from './$types'
import { isPlaidError, plaid } from '$lib/plaid'
import { error } from '@sveltejs/kit'

const requestSchema = z.object({
	public_token: z.string()
})

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json()
		const { public_token } = requestSchema.parse(data)

		const { data: plaidData } = await plaid.itemPublicTokenExchange({ public_token })
		console.log(plaidData)
	} catch (e) {
		if (e instanceof ZodError) {
			console.log('Validation Failed: ', e)
			throw error(500)
		}

		if (isPlaidError(e)) {
			console.log('Plaid Error: ', e)
			throw error(500)
		}
	}

	return new Response()
}
