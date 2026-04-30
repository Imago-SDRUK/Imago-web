<script lang="ts">
	import type { CkanextActivityGetActions } from '$lib/utils/ckan/extensions/versions/read'
	import { Accordion, Button, Icon, Paragraph, Subtitle } from '@imago/ui'
	import { getDataset } from '$lib/context/dataset.svelte'
	import { jstr } from '@arturoguzman/art-ui'
	import { DateTime } from 'luxon'
	const skip_keys = ['url', 'download_url', 'isopen']
	let ctx = getDataset()
	let { activities }: { activities: CkanextActivityGetActions[2] } = $props()
	const isEqual = <T,>(a: T, b: T): boolean => {
		if (a === b) {
			return true
		}

		const are_objects = a && b && typeof a === 'object' && typeof b === 'object'

		return Boolean(
			are_objects &&
			Object.keys(a).filter((a) => !skip_keys.includes(a)).length ===
				Object.keys(b).filter((b) => !skip_keys.includes(b)).length &&
			Object.entries(a).every(([k, v]) =>
				skip_keys.includes(k) ? true : isEqual(v, b[k as keyof T])
			)
		)
	}
	const diff = <T extends Record<PropertyKey, unknown>>({
		previous,
		current
	}: {
		previous: T
		current: T
	}) => {
		const changes: {
			added: Record<PropertyKey, unknown>
			removed: Record<PropertyKey, unknown>
			changed: {
				[k: string]: {
					previous: unknown
					current: unknown
				}
			}
		} = { added: {}, removed: {}, changed: {} }
		if (current && previous) {
			const entries_current = Object.entries(current)
			const checked_keys: string[] = []
			for (const [key, value] of entries_current) {
				if (skip_keys.includes(key)) {
					continue
				}
				if (key in previous === false && value && value !== '') {
					changes.added[key] = value
					checked_keys.push(key)
					continue
				}
				if (!isEqual(previous[key], current[key])) {
					changes.changed[key] = { previous: {}, current: {} }
					changes.changed[key].previous = previous[key]
					changes.changed[key].current = current[key]
					checked_keys.push(key)
				}
			}
			const previous_entries = Object.entries(previous).filter(
				(entry) => !checked_keys.includes(entry[0])
			)
			for (const [key, value] of previous_entries) {
				if (skip_keys.includes(key)) {
					continue
				}
				if (current[key]) {
					continue
				}
				if (value) {
					changes.removed[key] = value
				}
			}
		}
		return changes
	}
</script>

{#if Array.isArray(activities) && activities.length > 1}
	<div class="stream">
		<Subtitle size="md">Activity stream</Subtitle>
		{#each activities
			.map( (activity, index, arr) => ({ ...activity, diff: diff( { current: index === 0 ? ctx.dataset : arr[index - 1].data.package, previous: activity.data.package } ) }) )
			.filter( (activity) => (Object.values(activity.diff).every((value) => Object.keys(value).length === 0) ? false : true) ) as _activity, index}
			{@const activity = _activity.diff}
			<div class="accordion-wrapper">
				<Accordion>
					{#snippet title()}
						<Subtitle
							>Modified: {DateTime.fromISO(
								index === 0 ? ctx.dataset.metadata_modified : _activity.timestamp
							).toLocaleString(DateTime.DATETIME_FULL)}</Subtitle
						>
					{/snippet}
					{#snippet buttons({ toggleOpen, open })}
						<Button
							active={open}
							style="clean"
							onclick={() => {
								toggleOpen()
							}}
						>
							<Icon icon={{ icon: open ? 'chevron-down' : 'chevron-right', set: 'tabler' }}></Icon>
						</Button>
					{/snippet}
					<div class="activity">
						{#if Object.keys(activity.added).length > 0}
							<Subtitle>Added</Subtitle>
							{#each Object.entries(activity.added) as [key, value]}
								<div class="field">
									<div class="header">
										<Paragraph>{key}</Paragraph>
									</div>
									<div class="right-col">
										<Paragraph>{typeof value === 'object' ? jstr(value) : value}</Paragraph>
									</div>
								</div>
							{/each}
						{/if}

						{#if Object.keys(activity.changed).filter(([key]) => key !== 'metadata_modified').length > 0}
							<Subtitle>Changed</Subtitle>
							{#each Object.entries(activity.changed).filter(([key]) => key !== 'metadata_modified') as [key, value]}
								<div class="field">
									<div class="header">
										<Paragraph>{key}</Paragraph>
									</div>
									<div class="left-col">
										<div class="header">
											<Paragraph>Previous</Paragraph>
										</div>
										<Paragraph
											>{typeof value.previous === 'object'
												? jstr(value.previous)
												: value.previous}</Paragraph
										>
									</div>
									<div class="right-col">
										<div class="header">
											<Paragraph>Current</Paragraph>
										</div>
										<Paragraph
											>{typeof value.current === 'object'
												? jstr(value.current)
												: value.current}</Paragraph
										>
									</div>
								</div>
							{/each}
						{/if}
						{#if Object.keys(activity.removed).length > 0}
							<Subtitle>Removed</Subtitle>
							{#each Object.entries(activity.removed) as [key, value]}
								<div class="field">
									<div class="header">
										<Paragraph>{key}</Paragraph>
									</div>
									<div class="right-col">
										<Paragraph>{typeof value === 'object' ? jstr(value) : value}</Paragraph>
									</div>
								</div>
							{/each}
						{/if}
					</div>
				</Accordion>
			</div>
		{/each}
	</div>
{/if}

<style>
	.stream {
		background-color: var(--background-muted);
		color: var(--text);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-radius: var(--radius);
	}
	.activity {
		display: flex;
		flex-direction: column;
		background-color: var(--background-muted);
		border-radius: var(--radius);
		padding: 1rem;
		gap: 1rem;
	}
	.accordion-wrapper {
		border-radius: var(--radius);
		background-color: var(--background);
		padding: 1rem 0.5rem;
	}
	.field {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		grid-template-rows: minmax(0, max-content) minmax(0, 1fr);
		border: 1px solid var(--border);
	}
	.field > .header {
		grid-column: 1/-1;
		grid-row: 1 / 2;
		border-bottom: 1px solid var(--border);
		padding: 0.5rem;
	}
	.left-col {
		border-right: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0.5rem;
		overflow: hidden;
	}
	.right-col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0.5rem;
		overflow: hidden;
	}
</style>
