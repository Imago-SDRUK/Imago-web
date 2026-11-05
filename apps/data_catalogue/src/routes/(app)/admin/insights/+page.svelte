<script lang="ts">
	import { page } from '$app/state'
	import { untrack } from 'svelte'

	let { data } = $props()
	let from = $state(untrack(() => data.filters.from))
	let to = $state(untrack(() => data.filters.to))
	$effect(() => {
		from = data.filters.from
		to = data.filters.to
	})

	const countryNames = new Intl.DisplayNames(['en'], {
		type: 'region'
	})

	const getCountryName = (countryCode: string) => {
		return countryNames.of(countryCode.toUpperCase()) ?? countryCode
	}

	const categoryColours = [
		'#4F46E5',
		'#06B6D4',
		'#10B981',
		'#F59E0B',
		'#EF4444',
		'#8B5CF6',
		'#EC4899',
		'#64748B'
	]

	const categoryTotal = $derived(
		data.userInsights?.usersByCategory?.reduce(
			(sum: number, category: { category: string; total: number }) => sum + category.total,
			0
		) ?? 0
	)

	const getCategoryPieStyle = () => {
		const categories = data.userInsights?.usersByCategory ?? []

		if (!categoryTotal) {
			return ''
		}

		let currentPercentage = 0

		const segments = categories.map(
			(category: { category: string; total: number }, index: number) => {
				const percentage = (category.total / categoryTotal) * 100
				const start = currentPercentage
				const end = currentPercentage + percentage

				currentPercentage = end

				return `${categoryColours[index % categoryColours.length]} ${start}% ${end}%`
			}
		)

		return `conic-gradient(${segments.join(', ')})`
	}

	const getCategoryName = (category: string) => {
		return category.replace(/_/g, '-').replace(/^./, (letter) => letter.toUpperCase())
	}
</script>

<div class="page">
	<h1 class="page-title">Data Catalogue Engagement Insights</h1>
	<br/>
	<form class="date-filter" method="GET" action={page.url.pathname}>
		<label
			>From<input
				aria-label="From date"
				type="date"
				name="from"
				bind:value={from}
				max={to || undefined}
			/></label
		>
		<label
			>To<input
				aria-label="To date"
				type="date"
				name="to"
				bind:value={to}
				min={from || undefined}
			/></label
		>
		<div class="filter-actions">
			<button type="submit">Apply</button>
			<a class="reset-filter" href={page.url.pathname}>Reset</a>
		</div>
	</form>

	<!-- Main metrics -->
	<div class="metrics">
		<div class="metric-card">
			<p class="metric-label">Total downloads</p>
			<p class="metric-value">{data.downloads?.totalDownloads ?? 0}</p>
		</div>

		<div class="metric-card">
			<p class="metric-label">Total users</p>
			<p class="metric-value">{data.userInsights?.totalUsers ?? 0}</p>
		</div>

		<div class="metric-card">
			<p class="metric-label">Users who downloaded a dataset</p>
			<p class="metric-value">
				{data.userInsights?.usersWithDownloads ?? 0}
			</p>
		</div>

		<div class="metric-card">
			<p class="metric-label">Newsletter sign-ups</p>
			<p class="metric-value">{data.insights?.totalNewsletterSignUps ?? 0}</p>
		</div>
	</div>

	<!-- Top downloaded datasets -->
	<section class="section">
		<div class="card">
			<h2>Top 3 downloaded datasets</h2>

			<div class="table downloads-table">
				<div class="table-header">
					<span>#</span>
					<span>Dataset</span>
					<span>Downloads</span>
				</div>

				{#each data.downloads?.topDownloadedResources ?? [] as dataset, index}
					<div class="table-row">
						<span class="rank">{index + 1}</span>
						<span class="dataset-name">{dataset.resource_title}</span>
						<span class="count">{dataset.download_count}</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Users by country and category -->
	<section class="section">
		<div class="grid">
			<!-- Users by country -->
			<div class="card country-card">
				<h2>Users by country</h2>

				<div class="table country-table country-scroll">
					<div class="table-header">
						<span>Country</span>
						<span>Users</span>
					</div>

					{#each data.userInsights?.usersByCountry ?? [] as country}
						<div class="table-row">
							<span>
								{getCountryName(country.country)}
							</span>

							<span class="count">
								{country.total}
							</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Users by category -->
			<div class="card category-card">
				<h2>Users by category</h2>

				<div class="category-chart">
					{#if categoryTotal > 0}
						<div class="pie-chart" style={`background: ${getCategoryPieStyle()}`}>
							<div class="pie-centre"></div>
						</div>
					{:else}
						<div class="pie-chart empty-pie"></div>
					{/if}
				</div>

				<!-- Category key -->
				<div class="category-legend">
					{#each data.userInsights?.usersByCategory ?? [] as category, index}
						<div class="legend-item">
							<span
								class="legend-colour"
								style={`background: ${categoryColours[index % categoryColours.length]}`}
							></span>

							<span class="legend-category">
								{getCategoryName(category.category)}
							</span>

							<span class="legend-value">
								{category.total}
								({categoryTotal ? Math.round((category.total / categoryTotal) * 100) : 0}%)
							</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Top downloaded dataset by category -->
	<section class="section">
		<div class="card">
			<h2>Top downloaded dataset by category</h2>

			<div class="table category-downloads-table">
				<div class="table-header">
					<span>Category</span>
					<span>Dataset</span>
					<span>Downloads</span>
				</div>

				{#each data.insights?.topDownloadedResourcesByCategory ?? [] as dataset}
					<div class="table-row">
						<span class="category-name">
							{getCategoryName(dataset.category)}
						</span>

						<span class="dataset-title">
							{dataset.resource_title}
						</span>

						<span class="count">
							{dataset.download_count}
						</span>
					</div>
				{/each}
			</div>
		</div>
	</section>
</div>

<style>
	.page-title {
		margin: 0 0 1.25rem;
		font-size: clamp(1.25rem, 2vw, 1.6rem);
		font-weight: 600;
		line-height: 1.3;
		color: white;
	}
	.date-filter {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 1rem;
		padding: 1.25rem;
		border: 1px solid #e2e2e2;
		border-radius: 10px;
		background: #f8fafc;
	}
	.filter-heading {
		display: grid;
		gap: 0.35rem;
		margin-right: auto;
		align-self: center;
	}
	.filter-heading span,
	.filter-note {
		font-size: 0.8rem;
		color: #666;
	}
	.date-filter label {
		display: grid;
		gap: 0.4rem;
		font-size: 0.85rem;
		font-weight: 600;
	}
	.date-filter input {
		min-height: 42px;
		padding: 0.5rem 0.75rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font: inherit;
		background: white;
		color: inherit;
	}
	.filter-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-left: auto;
	}
	.date-filter button {
		min-height: 42px;
		padding: 0.5rem 1rem;
		border: 1px solid #334155;
		border-radius: 6px;
		background: #334155;
		color: white;
		font: inherit;
		cursor: pointer;
	}
	.reset-filter {
		display: inline-flex;
		align-items: center;
		min-height: 42px;
		justify-content: center;
		padding: 0.5rem 1rem;
		border: 1px solid #f09553;
		border-radius: 6px;
		background: #f09553;
		color: #1f2937;
		font: inherit;
		text-decoration: none;
	}
	.reset-filter:hover {
		background: #e88a44;
		border-color: #e88a44;
	}
	.filter-note {
		flex-basis: 100%;
		margin: 0;
		line-height: 1.5;
	}
	.date-filter :is(input, button, a):focus-visible {
		outline: 2px solid #4f46e5;
		outline-offset: 3px;
	}

	.page {
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem 2rem;
	}

	.section {
		margin-top: 1.5rem;
	}

	/* Main metrics */

	.metrics {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1.5rem;
		margin-top: 1.25rem;
	}

	.metric-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 140px;
		padding: 1.25rem;
		border: 1px solid #e2e2e2;
		border-radius: 10px;
		background: white;
		text-align: center;
	}

	.metric-label {
		margin: 0 0 0.75rem;
		font-size: 0.95rem;
		color: #666;
	}

	.metric-value {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
	}

	/* Two-column sections */

	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
	}

	.card {
		padding: 1.5rem;
		border: 1px solid #e2e2e2;
		border-radius: 10px;
		background: white;
	}

	h2 {
		margin: 0 0 1.25rem;
		font-size: 1.15rem;
		font-weight: 600;
	}

	/* Tables */

	.table {
		width: 100%;
	}

	.table-header,
	.table-row {
		display: grid;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 0;
	}

	.table-header {
		border-bottom: 1px solid #d9d9d9;
		padding-top: 0;
		font-size: 0.8rem;
		font-weight: 600;
		color: #666;
		text-transform: uppercase;
	}

	.table-row {
		border-bottom: 1px solid #eeeeee;
	}

	.table-row:last-child {
		border-bottom: none;
	}

	.count {
		font-weight: 600;
		text-align: center;
		white-space: nowrap;
	}

	.rank {
		font-weight: 600;
	}

	/* Country table */

	.country-card,
	.category-card {
		height: 500px;
		box-sizing: border-box;
	}

	.country-table .table-header,
	.country-table .table-row {
		grid-template-columns: minmax(0, 1fr) 100px;
	}

	.country-table .table-header span:last-child,
	.country-table .table-row .count {
		text-align: center;
	}

	.country-scroll {
		max-height: 405px;
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	/* Top 3 downloads */

	.downloads-table .table-header,
	.downloads-table .table-row {
		grid-template-columns: 35px minmax(0, 1fr) 100px;
	}

	.dataset-name {
		overflow-wrap: anywhere;
	}

	/* Category pie chart */

	.category-chart {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 0 1.25rem;
	}

	.pie-chart {
		position: relative;
		width: 220px;
		height: 220px;
		border-radius: 50%;
	}

	.pie-centre {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100px;
		height: 100px;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: white;
	}

	.empty-pie {
		border: 1px solid #e2e2e2;
		background: #f5f5f5;
	}

	/* Category legend */

	.category-legend {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.6rem 1.5rem;
		padding-top: 0.25rem;
		border-top: 1px solid #eeeeee;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
		font-size: 0.85rem;
	}

	.legend-colour {
		width: 10px;
		height: 10px;
		flex: 0 0 10px;
		border-radius: 2px;
	}

	.legend-category {
		overflow-wrap: anywhere;
	}

	.legend-value {
		margin-left: auto;
		font-weight: 600;
		white-space: nowrap;
	}

	/* Top dataset by category */

	.category-downloads-table .table-header,
	.category-downloads-table .table-row {
		grid-template-columns: minmax(130px, 0.8fr) minmax(0, 2fr) 100px;
		column-gap: 2rem;
	}

	.category-name,
	.dataset-title {
		overflow-wrap: anywhere;
	}

	@media (max-width: 1100px) {
		.metrics {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 768px) {
		.filter-heading {
			width: 100%;
		}
		.date-filter label {
			flex: 1;
			min-width: 130px;
		}
		.date-filter input {
			width: 100%;
			box-sizing: border-box;
		}

		.page {
			font-family:
				system-ui,
				-apple-system,
				BlinkMacSystemFont,
				'Segoe UI',
				sans-serif;
			padding: 0 1rem 1rem;
		}

		.metrics {
			grid-template-columns: 1fr;
		}

		.grid {
			grid-template-columns: 1fr;
		}

		.country-card,
		.category-card {
			height: auto;
			min-height: 500px;
		}

		.country-scroll {
			max-height: 405px;
		}

		.category-downloads-table .table-header,
		.category-downloads-table .table-row {
			grid-template-columns: minmax(100px, 0.8fr) minmax(0, 1.5fr) 80px;
			column-gap: 1rem;
		}

		.pie-chart {
			width: 200px;
			height: 200px;
		}

		.pie-centre {
			width: 90px;
			height: 90px;
		}

		.category-legend {
			grid-template-columns: 1fr;
		}
	}
</style>
