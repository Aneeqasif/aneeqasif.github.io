<script lang="ts">
	import { onMount } from "svelte";
	import type { WalineInstance } from "@waline/client";
	import { walineClientConfig } from "@/config/comments/waline";

	import "@waline/client/style";
	import "@/styles/custom/waline.css";

	export let path: string;
	export let lang: string | undefined;

	let container: HTMLDivElement | null = null;
	let instance: WalineInstance | null = null;
	let currentPath: string | null = null;
	let currentLang: string | undefined;

	const resolveLang = () => lang ?? walineClientConfig.lang ?? undefined;

	onMount(async () => {
		const { init } = await import("@waline/client");
		const initialLang = resolveLang();

		instance = init({
			...walineClientConfig,
			el: container,
			path,
			lang: initialLang,
		});
		currentPath = path;
		currentLang = initialLang;

		return () => {
			instance?.destroy();
			instance = null;
			currentPath = null;
			currentLang = undefined;
		};
	});

	$: if (instance) {
		const nextLang = resolveLang();
		if (path !== currentPath || nextLang !== currentLang) {
			instance.update({
				path,
				lang: nextLang,
			});
			currentPath = path;
			currentLang = nextLang;
		}
	}
</script>

<div bind:this={container} class="waline-container" data-no-swup></div>
