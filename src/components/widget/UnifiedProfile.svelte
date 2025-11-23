<script>
import Icon from "@iconify/svelte";
import { onMount } from "svelte";
import { fly } from "svelte/transition";

export let profileConfig;
export let categories;
export let tags;
export let avatarSrc;
export let className = "";
export let style = "";

let activeTab = "profile";
let direction = 1; // 1 for right, -1 for left
let isHovered = false;
let isInteractive = false;

const tabs = ["profile", "categories", "tags"];

function switchTab(newTab) {
	if (activeTab === newTab) return;
	const oldIndex = tabs.indexOf(activeTab);
	const newIndex = tabs.indexOf(newTab);
	direction = newIndex > oldIndex ? 1 : -1;
	activeTab = newTab;
}

onMount(() => {
	// Initial safety delay
	setTimeout(() => {
		isInteractive = true;
	}, 800);

	const handleStart = () => {
		isHovered = false;
		isInteractive = false;
	};

	const handleEnd = () => {
		// Re-enable interaction after transition settles
		setTimeout(() => {
			isInteractive = true;
		}, 500);
	};

	document.addEventListener("swup:visit:start", handleStart);
	document.addEventListener("swup:visit:end", handleEnd);

	return () => {
		document.removeEventListener("swup:visit:start", handleStart);
		document.removeEventListener("swup:visit:end", handleEnd);
	};
});

// Scroll shadow logic
let categoriesContainer;
let tagsContainer;

let profileHeight;
let fixedHeight;

$: if (activeTab === "profile" && profileHeight) {
	fixedHeight = profileHeight;
}
</script>

<div class={"card-base p-3 " + className} {style}>
    <!-- Content Area -->
    <div class="overflow-hidden relative transition-all duration-300 min-h-[420px]" style="height: {fixedHeight ? fixedHeight + 'px' : 'auto'}">
        {#key activeTab}
            <div
                class="absolute top-0 left-0 w-full"
                in:fly={{ x: 20 * direction, duration: 300, delay: 50 }}
                out:fly={{ x: -20 * direction, duration: 300 }}
            >
                {#if activeTab === "profile"}
                    <!-- Profile Content -->
                    <div bind:clientHeight={profileHeight} class:invisible={activeTab !== 'profile' && fixedHeight}>
                        <a
                            aria-label="Go to About Page"
                            href="/about/"
                            class="block relative mx-auto mt-1 mb-3 max-w-[12rem] lg:mx-0 lg:mt-0 lg:max-w-none overflow-hidden rounded-xl active:scale-95"
                            on:mouseenter={() => {
                                if (isInteractive) {
                                    isHovered = true;
                                }
                            }}
                            on:mouseleave={() => isHovered = false}
                        >
                            <div
                                class={"absolute transition pointer-events-none w-full h-full z-50 flex items-center justify-center " + (isHovered && isInteractive ? "bg-black/30" : "")}
                            >
                                <div class={"transition duration-200 " + (isHovered && isInteractive ? "opacity-100 scale-100" : "opacity-0 scale-90")}>
                                    <Icon
                                        icon="fa6-regular:address-card"
                                        class="text-white text-5xl"
                                    />
                                </div>
                            </div>
                            <img
                                src={avatarSrc}
                                alt="Profile Image of the Author"
                                class="mx-auto w-full h-full object-cover lg:w-full lg:mt-0"
                            />
                        </a>
                        <div class="px-2 w-full">
                            <div
                                class="font-bold text-xl text-center mb-1 dark:text-neutral-50 transition ui-primary-font"
                            >
                                {profileConfig.name}
                            </div>
                            <div
                                class="h-1 w-5 bg-[var(--primary)] mx-auto rounded-full mb-2 transition"
                            ></div>
                            <div
                                class="text-center text-neutral-400 mb-2.5 transition"
                            >
                                {profileConfig.bio}
                            </div>
                            <div class="flex flex-wrap gap-2 justify-center mb-1">
                                {#each profileConfig.links as item}
                                    <a
                                        rel="me"
                                        aria-label={item.name}
                                        href={item.url}
                                        target="_blank"
                                        class="btn-regular rounded-lg h-10 w-10 active:scale-90 flex items-center justify-center"
                                    >
                                        <Icon icon={item.icon} class="text-[1.5rem]" />
                                    </a>
                                {/each}
                            </div>  
                        </div>
                    </div>
                {:else if activeTab === "categories"}
                    <!-- Categories Content -->
                    <div class="relative w-full flex flex-col" style="height: {fixedHeight}px">
                        <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-1 mb-2 ui-primary-font before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-16px] before:top-[5.5px] shrink-0">Categories</div>
                        <div
                            class="overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] flex-1 min-h-0"
                            style="mask-image: linear-gradient(to bottom, black calc(100% - 20px), transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 50px), transparent 100%);"
                            bind:this={categoriesContainer}
                        >
                            <div class="flex flex-col gap-1 px-4 pb-8">
                                {#each categories as c}
                                    <a
                                        href={c.url}
                                        aria-label={`View all posts in the ${c.name} category`}
                                        class="w-full h-10 rounded-lg bg-none hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition-all pl-2 hover:pl-3 text-neutral-700 hover:text-[var(--primary)] dark:text-neutral-300 dark:hover:text-[var(--primary)] flex items-center justify-between group"
                                    >
                                        <div class="overflow-hidden text-left whitespace-nowrap overflow-ellipsis">
                                            {c.name}
                                        </div>
                                        <div class="transition px-2 h-7 ml-4 min-w-[2rem] rounded-lg text-sm font-bold text-[var(--btn-content)] dark:text-[var(--deep-text)] bg-[var(--btn-regular-bg)] dark:bg-[var(--primary)] flex items-center justify-center">
                                            {c.count}
                                        </div>
                                    </a>
                                {/each}
                            </div>
                        </div>
                    </div>
                {:else if activeTab === "tags"}
                    <!-- Tags Content -->
                    <div class="relative w-full flex flex-col" style="height: {fixedHeight}px">
                        <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-1 mb-2 ui-primary-font before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)] before:absolute before:left-[-16px] before:top-[5.5px] shrink-0">Tags</div>
                        <div
                            class="overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] flex-1 min-h-0"
                            style="mask-image: linear-gradient(to bottom, black calc(100% - 20px), transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 30px), transparent 100%);"
                            bind:this={tagsContainer}
                        >
                            <div class="flex flex-wrap gap-2 px-4 pb-8">
                                {#each tags as t}
                                    <a
                                        href={t.url}
                                        aria-label={`View all posts with the ${t.name} tag`}
                                        class="btn-regular h-8 text-sm px-3 rounded-lg flex items-center gap-2 active:scale-95"
                                    >
                                        <span>{t.name}</span>
                                        <!-- <span class="opacity-50 text-xs">{t.count}</span> -->
                                    </a>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {/key}
    </div>
</div>

<!-- Bottom Navigation -->
<div class={"card-base p-2 mt-1 flex gap-2"} {style}>
    <button
        class={"flex-1 flex items-center justify-center py-2 rounded-xl transition-all duration-300 " +
            (activeTab === "profile"
                ? "bg-[var(--btn-regular-bg)] text-[var(--primary)]  "
                : "text-black dark:text-white opacity-60 hover:opacity-100")}
        on:click={() => switchTab("profile")}
        aria-label="Profile"
    >
        <Icon icon="material-symbols:person" class="text-xl" />
    </button>
    <button
        class={"flex-1 flex items-center justify-center py-2 rounded-xl transition-all duration-300 " +
            (activeTab === "categories"
                ? "bg-[var(--btn-regular-bg)] text-[var(--primary)]"
                : "text-black dark:text-white opacity-60 hover:opacity-100")}
        on:click={() => switchTab("categories")}
        aria-label="Categories"
    >
        <Icon icon="material-symbols:folder-outline-rounded" class="text-xl" />
    </button>
    <button
        class={"flex-1 flex items-center justify-center py-2 rounded-xl transition-all duration-300 " +
            (activeTab === "tags"
                ? "bg-[var(--btn-regular-bg)] text-[var(--primary)] "
                : "text-black dark:text-white opacity-60 hover:opacity-100")}
        on:click={() => switchTab("tags")}
        aria-label="Tags"
    >
        <Icon icon="si:bookmark-duotone" class="text-xl" />
    </button>
</div>
