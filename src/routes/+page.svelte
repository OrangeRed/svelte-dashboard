<script lang="ts">
	import type { PageData } from './$types'
	import { formatToCurrency } from '$lib/utils'

	export let data: PageData
	const { cash, investments, totals } = data
</script>

<main class="grid xl:grid-cols-2 mb-4">
	<section class="flex flex-col mx-4 gap-y-4">
		<div class="flex justify-between text-5xl">
			<h1>Cash</h1>
			<h1>{formatToCurrency(totals.cash)}</h1>
		</div>

		{#each cash as cashAccount}
			<div class="stats shadow bg-primary-content border-primary/50 border-b-2 py-2">
				<div class="stat flex justify-between">
					<div class="stat-title text-base-content flex flex-col">
						<div>{cashAccount.name} <span class="opacity-50">- {cashAccount.mask}</span></div>
						<small class="opacity-70 overflow-hidden whitespace-nowrap text-ellipsis">
							{cashAccount.official_name}
						</small>
					</div>
					<div class="text-3xl text-end">
						{formatToCurrency(cashAccount.balances.current)}
					</div>
				</div>
			</div>
		{/each}

		<div class="flex justify-between text-5xl mt-4">
			<h1>Investments</h1>
			<h1>{formatToCurrency(totals.investments)}</h1>
		</div>
		{#each investments as investment}
			<div class="stats bg-primary-content py-2 border-primary/50 border-b-2">
				<div class="collapse collapse-arrow">
					<!-- Not needed if "collapse-open" -->
					<input type="checkbox" />
					<div class="collapse-title flex justify-between">
						<div class="flex flex-col">
							<div>{investment.name} <span class="opacity-50">- {investment.mask}</span></div>
							<small class="opacity-70 overflow-hidden whitespace-nowrap text-ellipsis">
								{investment.official_name ?? ''}
							</small>
						</div>
						<div class="text-3xl">{formatToCurrency(investment.balances.current)}</div>
					</div>
					<div class="collapse-content p-0 delay">
						<table class="table table-fixed">
							<thead>
								<tr>
									<th>Ticker</th>
									<th class="w-28 text-end">Quantity</th>
									<th class="w-28 text-end">Share Price</th>
									<th class="w-28 text-end">Current Value</th>
								</tr>
							</thead>
							<tbody>
								{#each investment.holdings as holding}
									<tr
										class="[&_span]:text-ellipsis [&_span]:whitespace-nowrap [&_span]:overflow-hidden"
									>
										<td title={holding.name} class="flex flex-col">
											{#if holding.ticker_symbol}
												<span>{holding.ticker_symbol}</span>
												<span class="opacity-70">{holding.name}</span>
											{:else}
												<span class="py-2">{holding.name}</span>
											{/if}
										</td>
										<td class="text-end">
											{holding.quantity.toLocaleString('en-US', { maximumFractionDigits: 3 })}
										</td>
										<td class="text-end">{formatToCurrency(holding.institution_price)}</td>
										<td class="text-end">{formatToCurrency(holding.institution_value)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/each}
	</section>

	<section class="bg-primary-content rounded-xl">
		<table class="table">
			<tbody>
				{#each data.securities as security}
					<tr>
						<td title={security.name} class="flex flex-col">
							{#if security.ticker_symbol}
								<span>{security.ticker_symbol}</span>
								<span class="opacity-70">{security.name}</span>
							{:else}
								<span class="py-2">{security.name}</span>
							{/if}
						</td>
						<td class="text-end">{formatToCurrency(security.close_price)}</td>
						<td>{security.type}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</main>
