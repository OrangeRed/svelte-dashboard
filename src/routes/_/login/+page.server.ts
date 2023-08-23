import { z } from 'zod'
import { setError, superValidate } from 'sveltekit-superforms/server'

import type { Actions, PageServerLoad } from './$types'

import { ClientResponseError } from 'pocketbase'
import { redirect } from '@sveltejs/kit'

const loginSchema = z
	.object({
		email: z.string().email(),
		password: z.string()
	})
	.required()

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/_')
	}

	return {
		form: superValidate(loginSchema)
	}
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, loginSchema)

		if (!form.valid) {
			return { form }
		}

		try {
			await event.locals.pb.admins.authWithPassword(form.data.email, form.data.password)
		} catch (e) {
			if (e instanceof ClientResponseError) {
				return setError(form, 'Invalid Email or Password')
			}

			console.log(e)
		}

		throw redirect(303, '/_')
	}
}
