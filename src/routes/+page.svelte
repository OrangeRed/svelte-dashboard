<script lang="ts">
	import type { PageData } from './$types'
	import { formatToCurrency } from '$lib/utils'

	export let data: PageData
	const { cash, credit, investments, securities, totals } = data
</script>

<main class="mb-4 grid xl:grid-cols-2">
	<section class="mx-4 flex flex-col gap-y-4">
		<div class="flex justify-between text-5xl">
			<h1>Cash</h1>
			<h1>{formatToCurrency(totals.cash)}</h1>
		</div>

		{#each cash as cashAccount}
			<div class="stats border-b-2 border-primary/50 bg-primary-content py-2 shadow">
				<div class="stat flex justify-between">
					<div class="stat-title flex flex-col text-base-content">
						<div>{cashAccount.name} <span class="opacity-50">- {cashAccount.mask}</span></div>
						<small class="overflow-hidden text-ellipsis whitespace-nowrap opacity-70">
							{cashAccount.official_name}
						</small>
					</div>
					<div class="text-end text-3xl">
						{formatToCurrency(cashAccount.balances.current)}
					</div>
				</div>
			</div>
		{/each}

		<div class="flex justify-between text-5xl">
			<h1>Credit</h1>
		</div>

		{#each credit as creditAccount}
			<stats class="card border-b-2 border-primary/50 bg-primary-content">
				<div class="card-body">
					<div class="grid grid-cols-2 text-base-content">
						<div>{creditAccount.name} <span class="opacity-50">- {creditAccount.mask}</span></div>

						{#if creditAccount.next_payment_due_date}
							<p class="text-end text-sm opacity-70">
								Statement closing {new Date(creditAccount.next_payment_due_date)
									.toDateString()
									.slice(4)}
							</p>
						{/if}

						<small class="col-span-2 overflow-hidden text-ellipsis whitespace-nowrap opacity-70">
							{creditAccount.official_name}
						</small>

						<left class="mt-4">
							<p>Current Balance</p>
							<div class="my-2 text-4xl">
								{formatToCurrency(creditAccount.balances.current)}
							</div>

							<!-- {#if creditAccount.transactions}
								<button class="text-sm font-semibold">View transactions</button>
							{/if} -->
						</left>

						<right class="my-auto">
							<div class="flex flex-col text-end text-lg">
								<small class="opacity-70">Credit Limit</small>
								{formatToCurrency(creditAccount.balances.limit)}
							</div>
							<progress
								class="progress h-3"
								value={creditAccount.balances.current}
								max={creditAccount.balances.limit}
							/>
						</right>
					</div>
				</div>
			</stats>
			<!-- <pre>{JSON.stringify(creditAccount, null, 2)}</pre> -->
		{/each}
	</section>

	<section class="mx-4 flex flex-col gap-y-4">
		<div class="flex justify-between text-5xl">
			<h1>Investments</h1>
			<h1>{formatToCurrency(totals.investments)}</h1>
		</div>

		{#each investments as investment}
			<div class="stats border-b-2 border-primary/50 bg-primary-content py-2">
				<div class="collapse collapse-arrow">
					<input type="checkbox" />
					<div class="collapse-title flex justify-between">
						<div class="flex flex-col">
							<div>{investment.name} <span class="opacity-50">- {investment.mask}</span></div>
							<small class="overflow-hidden text-ellipsis whitespace-nowrap opacity-70">
								{investment.official_name ?? ''}
							</small>
						</div>
						<div class="text-3xl">{formatToCurrency(investment.balances.current)}</div>
					</div>
					<div class="delay collapse-content p-0">
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
										class="[&_span]:overflow-hidden [&_span]:text-ellipsis [&_span]:whitespace-nowrap"
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

		<table class="table bg-primary-content">
			<thead>
				<tr>
					<th>Security</th>
					<th>Share price</th>
					<th>Type</th>
				</tr>
			</thead>

			<tbody>
				{#each securities as [id, security]}
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
