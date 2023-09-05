/**
 * Convert a number into a currency string.
 *
 * @default
 * ```
 * style = 'currency', currency = 'USD'
 * ```
 */
export default function formatToCurrency(
	value?: number | null,
	options?: Intl.NumberFormatOptions
) {
	if (!value && value !== 0) {
		return 'Unknown'
	}

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		...options // will overwrite defaults if different value is provided
	})

	return formatter.format(value)
}
