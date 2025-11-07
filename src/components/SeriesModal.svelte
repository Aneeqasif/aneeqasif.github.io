<script lang="ts"></script>
	import { onMount } from "svelte";
	import SeriesPanel from "./SeriesPanel.svelte";

	export let show = false;
	export let seriesName: string;
	export let allSeriesPosts: any[];
	export let currentPart: number;
	export let currentSlug: string;
	export let onClose: () => void;
	export let onPostClick: (event: MouseEvent, slug: string) => void;

	let portalTarget: HTMLElement | null = null;

	onMount(() => {
		// Create portal target at body level
		portalTarget = document.createElement('div');
		portalTarget.id = 'series-modal-portal';
		portalTarget.setAttribute('data-no-swup', '');
		document.body.appendChild(portalTarget);

		return () => {
			// Cleanup on unmount
			if (portalTarget && portalTarget.parentNode) {
				portalTarget.parentNode.removeChild(portalTarget);
			}
		};
	});
</script>

{#if show && portalTarget}
	<div class="modal-overlay" data-no-swup on:click={onClose}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal-content" on:click|stopPropagation>
			<div class="modal-header">
				<button class="close-btn" on:click={onClose} aria-label="Close modal">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<div class="modal-body">
				<SeriesPanel 
					sortedPosts={allSeriesPosts}
					filterSeriesName={seriesName}
					hideDate={true}
					hideTags={true}
					currentPartNumber={currentPart}
					{onPostClick}
				/>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		z-index: 9999;
		padding: 4rem 1rem 1rem 1rem;
		overflow-y: auto;
	}

	.modal-content {
		background: var(--card-bg);
		border-radius: var(--radius-large);
		max-width: 700px;
		width: 100%;
		max-height: 80vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 10000;
	}

	.modal-header {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 1rem 1.5rem;
	}

	.close-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-color);
		opacity: 0.7;
		transition: opacity 0.2s;
		border-radius: 8px;
	}

	.close-btn:hover {
		opacity: 1;
		background: rgba(0, 0, 0, 0.05);
	}

	.modal-body {
		padding: 0 2rem 2rem 2rem;
		overflow-y: auto;
		flex: 1;
	}

	.modal-body :global(.card-base) {
		padding: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
	}

	@media (max-width: 768px) {
		.modal-content {
			max-width: 100%;
			max-height: 90vh;
		}

		.modal-header {
			padding: 1rem 1.5rem;
		}

		.modal-body {
			padding: 1rem 1.5rem;
		}
	}
</style>
