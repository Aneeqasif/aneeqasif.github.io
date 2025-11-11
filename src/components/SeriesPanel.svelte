<script lang="ts">
import { onMount } from "svelte";

import { getPostUrlBySlug } from "../utils/url-utils";

export let sortedPosts: Post[] = [];
export let filterSeriesName: string | null = null; // Filter to show only one series
export let hideDate = false; // Hide date column
export let hideTags = false; // Hide tags column
export let currentPartNumber: number | null = null; // Highlight current part
export let onPostClick: ((event: MouseEvent, slug: string) => void) | null =
	null; // Custom click handler

interface Post {
	slug: string;
	data: {
		title: string;
		tags: string[];
		published: Date;
		series?: {
			name: string;
			part: number;
		};
	};
}

interface SeriesGroup {
	name: string;
	posts: Post[];
}

let seriesGroups: SeriesGroup[] = [];

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	const year = date.getFullYear();
	return `${year}-${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

onMount(async () => {
	// Filter posts that have series information
	const postsWithSeries = sortedPosts.filter(
		(post) =>
			post.data.series && post.data.series.name && post.data.series.part,
	);

	// Group posts by series name
	const grouped = postsWithSeries.reduce(
		(acc, post) => {
			const seriesName = post.data.series!.name;
			// If filtering by series name, skip other series
			if (filterSeriesName && seriesName !== filterSeriesName) {
				return acc;
			}
			if (!acc[seriesName]) {
				acc[seriesName] = [];
			}
			acc[seriesName].push(post);
			return acc;
		},
		{} as Record<string, Post[]>,
	);

	// Convert to array and sort posts within each series by part number
	const groupedArray = Object.keys(grouped).map((seriesName) => ({
		name: seriesName,
		posts: grouped[seriesName].sort(
			(a, b) => a.data.series!.part - b.data.series!.part,
		),
	}));

	// Sort series alphabetically by name
	groupedArray.sort((a, b) => a.name.localeCompare(b.name));

	seriesGroups = groupedArray;
});
</script>

<div class="card-base px-8 py-6">
	{#if seriesGroups.length === 0}
		<div class="text-center text-50 py-8">
			No series found
		</div>
	{:else}
		{#each seriesGroups as series, index}
			<div class:mb-8={index < seriesGroups.length - 1}>
				<!-- Series Name Header - aligned with right edge of Part number column -->
				<div class="mb-2">
					<h2 class="text-2xl font-bold text-[var(--primary)] ml-[5%] ui-primary-font">
					<!-- <h2 class="text-2xl font-bold text-75 ml-[5%] ui-primary-font"> -->
						{series.name}
					</h2>
				</div>

				<!-- Timeline row with circle and parts count -->
				<div class="flex flex-row w-full items-center h-10">
					<!-- Left column - empty -->
					<div class="w-[15%] md:w-[10%]"></div>
					
					<!-- Middle column - circle (NO dash-line here, just like Archive) -->
					<div class="w-[15%] md:w-[10%]">
						<div
							class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
							-outline-offset-[2px] z-50 outline-3"
						></div>
					</div>
					
					<!-- Right column - parts count -->
					<div class="w-[70%] md:w-[80%] transition text-left text-50">
						{series.posts.length} {series.posts.length === 1 ? 'part' : 'parts'}
					</div>
				</div>

				<!-- Series Posts -->
				{#each series.posts as post}
					<a
						href={getPostUrlBySlug(post.slug)}
						aria-label={post.data.title}
						class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
						class:current-post={currentPartNumber && post.data.series?.part === currentPartNumber}
						on:click={(e) => onPostClick && onPostClick(e, post.slug)}
					>
						<div class="flex flex-row justify-start items-center h-full">
							<!-- Part number -->
							<div class="w-[15%] md:w-[10%] transition text-sm text-right text-50">
								<span class="font-bold">Part {post.data.series?.part}</span>
							</div>

							<!-- Dot and line -->
							<div class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
								<div
									class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
									bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
									outline outline-4 z-50
									outline-[var(--card-bg)]
									group-hover:outline-[var(--btn-plain-bg-hover)]
									group-active:outline-[var(--btn-plain-bg-active)]"
								></div>
							</div>

							<!-- Post title -->
							<div
								class:w-[70%]={hideDate && hideTags}
								class:md:w-[80%]={hideDate && hideTags}
								class:w-[40%]={!hideDate || !hideTags}
								class:md:w-[50%]={!hideDate || !hideTags}
								class="text-left font-bold ui-secondary-font
								group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
								text-75 pr-4 whitespace-nowrap overflow-ellipsis overflow-hidden"
							>
								{post.data.title}
							</div>

							<!-- Date -->
							{#if !hideDate}
							<div
								class="hidden md:block md:w-[15%] text-left text-sm transition
								whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
							>
								{formatDate(post.data.published)}
							</div>
							{/if}

							<!-- Tag list -->
							{#if !hideTags}
							<div
								class="hidden md:block md:w-[15%] text-left text-sm transition
								whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
							>
								{formatTag(post.data.tags)}
							</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{/each}
	{/if}
</div>

<style>
.dash-line {
	position: relative;
}

.dash-line::before {
	content: "";
	position: absolute;
	width: 10%;
	height: 100%;
	left: calc(50% - 1px);
	border-left: 2px dashed var(--line-color);
	pointer-events: none;
	transition: all 0.3s;
	transform: translateY(-50%);
}

.current-post .text-75 {
	color: var(--primary) !important;
	font-weight: bold;
}

/* Larger dot for current post */
.current-post .dash-line > div {
	width: 0.5rem !important;
	height: 0.5rem !important;
	background: var(--primary) !important;
}
</style>
