<script lang="ts">
	import { type ICellProps } from '@svar-ui/svelte-grid'
	import BaseCell from './base_cell.svelte'
	import { Paragraph } from '@imago/ui'
	let { column, row }: ICellProps = $props()
	const key = $derived(String(column['id']))
	const statuses: {
		label: string
		value: string
		style: 'base' | 'label' | 'warning' | 'positive' | 'negative' | 'danger'
	}[] = [
		{
			value: 'pending',
			style: 'warning',
			label: 'Pending'
		}
	]
</script>

<BaseCell>
	{#if row[key] !== undefined && row[key] !== null}
		<Paragraph size="sm"
			>{key === 'status'
				? (statuses.find((status) => status.value === row[key])?.label ?? row[key])
				: String(row[key])}</Paragraph
		>
	{:else}
		<Paragraph size="sm">-</Paragraph>
	{/if}
</BaseCell>

<style>
</style>
