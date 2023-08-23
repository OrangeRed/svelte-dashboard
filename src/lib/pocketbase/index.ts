/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	AccessTokens = "access_tokens",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AccessTokensRecord<Tenabled_products = unknown> = {
	access_token: string
	institution_id: string
	institution_name?: string
	enabled_products?: null | Tenabled_products
}

export type UsersRecord = {
	name?: string
	avatar?: string
}

// Response types include system fields and match responses from the PocketBase API
export type AccessTokensResponse<Tenabled_products = unknown, Texpand = unknown> = Required<AccessTokensRecord<Tenabled_products>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	access_tokens: AccessTokensRecord
	users: UsersRecord
}

export type CollectionResponses = {
	access_tokens: AccessTokensResponse
	users: UsersResponse
}