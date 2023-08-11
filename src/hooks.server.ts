import { POCKETBASE_ADMIN, POCKETBASE_ADMIN_PASSWORD, POCKETBASE_URL } from '$env/static/private'

import Pocketbase from 'pocketbase'

import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new Pocketbase(POCKETBASE_URL)

	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		event.locals.pb.authStore.isValid && (await event.locals.pb.admins.authRefresh())
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear()
	}

	const response = await resolve(event)

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie())

	return response
}
