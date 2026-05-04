<script lang="ts">
	import type { Subscriber, Unsubscriber, Updater } from 'svelte/store'
	import { slide } from 'svelte/transition'
	import type { Notification } from './types'
	import { Paragraph } from '@imago/ui'
	let {
		notify
	}: {
		notify: {
			send: (notification: string | Notification) => void
			set: (this: void, value: Notification[]) => void
			update: (this: void, updater: Updater<Notification[]>) => void
			subscribe: (
				this: void,
				run: Subscriber<Notification[]>,
				invalidate?: () => void
			) => Unsubscriber
			remove: (id?: string) => void
		}
	} = $props()
</script>

<div class="notifications">
	{#each $notify as notification (notification)}
		<button
			onclick={() => {
				clearTimeout(notification.cancel)
				notify.remove(notification.id)
			}}
			transition:slide
			class="notification"
			style:--duration={`${notification.duration}ms`}
		>
			<Paragraph
				>{notification.status ? `${notification.status}: ` : ''}{notification.message}</Paragraph
			>
		</button>
	{/each}
</div>

<style>
	.notification {
		border: 1px solid var(--highlight);
		color: var(--text);
		background-color: var(--background);
		padding: 1rem;
		border-radius: 0.35rem;
		cursor: pointer;
		/* box-shadow: 2px 2px var(text); */
		position: relative;
		overflow: hidden;
		font-family: var(--title);
		flex-shrink: 0;
	}
	.notification::after {
		content: '';
		position: absolute;
		bottom: 0rem;
		left: 0rem;
		width: 0%;
		height: 0.35rem;
		background-color: var(--highlight);
		animation: progress var(--duration) forwards linear;
		flex-shrink: 0;
	}

	@keyframes progress {
		0% {
			width: 0%;
		}
		100% {
			width: 100%;
		}
	}

	.notifications {
		position: fixed;
		top: 4rem;
		right: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		z-index: 1000;
	}
	@media (min-width: 768px) {
		.notifications {
			top: 2rem;
			right: 2rem;
			max-height: calc(100lvh - 4rem);
			overflow-y: scroll;
			scrollbar-width: none;
		}
	}
</style>
