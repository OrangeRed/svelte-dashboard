import type { BaseSystemFields } from './types'

type TableColumns<T> = T extends ''
	? keyof Omit<BaseSystemFields, 'expand'>
	: T extends string
	? keyof Omit<BaseSystemFields, 'expand'> | T
	: keyof Omit<BaseSystemFields, 'expand'> | keyof T

type FilterOperators =
	| '=' //    Equal
	| '!=' //   NOT equal
	| '>' //    Greater than
	| '>=' //   Greater than or equal
	| '<' //    Less than
	| '<=' //   Less than or equal
	| '~' //    Like/Contains (if not specified auto wraps the right string VALUE in a "%" for wildcard match)
	| '!~' //   NOT Like/Contains (if not specified auto wraps the right string VALUe in a "%" for wildcard match)
	| '?=' //   Any/At least one of Equal
	| '?!=' //  Any/At least one of NOT equal
	| '?>' //   Any/At least one of Greater than
	| '?>=' //  Any/At least one of Greater than or equal
	| '?<' //   Any/At least one of Less than
	| '?<=' //  Any/At least one of Less than or equal
	| '?~' //   Any/At least one of Like/Contains (if not specified auto wraps the right string VALUE in a "%" for wildcard match)
	| '?!~' //  Any/At least one of NOT Like/Contains (if not specified auto wraps the right string VALUE in a "%" for wildcard match)

/**
 * Create Pocketbase filter expressions in a more ergonomic way
 *
 * Use generic `T` to get completions on your collection's column names
 *
 * @see {@link FilterOperators} type for the entire list of operators
 *
 * @example
 * ```
 * where(["title", "~", "abc"])
 *  --> 'title~"abc"'
 *
 * where(["created", ">", "2022-01-01"])
 *  --> 'created>"2022-01-01"'
 * ```
 * - Will combine expressions using `&&`. Use `whereOr()` to combine using `||`
 * ```
 * where(["title", "~", "abc"], ["created", ">", "2022-01-01"])
 *  --> 'title~"abc"&&created>"2022-01-01"'
 * ```
 */
export function where<T extends Record<string, unknown> | string>(
	...filterTuples: [TableColumns<T>, FilterOperators, string][]
) {
	return filterTuples
		.map(([COLUMN, OPERATOR, VALUE]) => `${COLUMN.toString()}${OPERATOR}"${VALUE}"`)
		.join('&&')
}

/**
 * Create Pocketbase filter expressions in a more ergonomic way
 *
 * Use generic `T` to get completions on your collection's column names
 *
 * @see {@link FilterOperators} type for the entire list of operators
 *
 * @example
 * ```
 * whereOr(["title", "~", "abc"])
 * --> 'title~"abc"'
 *
 * whereOr(["created", ">", "2022-01-01"])
 * --> 'created>"2022-01-01"'
 * ```
 * - Will combine expressions using `||`. Use `where()` to combine using `&&`
 * ```
 * whereOr(["title", "~", "abc"], ["created", ">", "2022-01-01"])
 * --> 'title~"abc"||created>"2022-01-01"'
 * ```
 */
export function whereOr<T extends Record<string, unknown> | string>(
	...filterTuples: [TableColumns<T>, FilterOperators, string][]
) {
	return filterTuples
		.map(([COLUMN, OPERATOR, VALUE]) => `${COLUMN.toString()}${OPERATOR}"${VALUE}"`)
		.join('||')
}
