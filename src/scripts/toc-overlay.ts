type CleanupFn = () => void;

let wrapperRef: HTMLElement | null = null;
let cleanupRef: CleanupFn | undefined;
let closeRef: CleanupFn | undefined;

export const getTocWrapper = () => wrapperRef;

export const closeTocOverlay = () => {
	closeRef?.();
};

export const cleanupTocOverlay = () => {
	cleanupRef?.();
	cleanupRef = undefined;
	closeRef = undefined;
	wrapperRef = null;
};

export const initTocOverlay = () => {
	cleanupTocOverlay();

	const wrapper = document.getElementById("toc-wrapper");
	const toggle = document.getElementById(
		"toc-toggle",
	) as HTMLButtonElement | null;
	const panel = document.getElementById("toc-panel") as HTMLElement | null;
	if (!wrapper || !toggle || !panel) {
		return;
	}

	const tocActive = wrapper.dataset.tocActive !== "false";

	if (!tocActive) {
		wrapper.setAttribute("hidden", "true");
		wrapper.classList.add("toc-hide", "toc-not-ready");
		toggle.setAttribute("aria-hidden", "true");
		toggle.setAttribute("tabindex", "-1");
		toggle.disabled = true;
		closeRef = undefined;
		return;
	}

	wrapper.removeAttribute("hidden");
	wrapper.classList.remove("toc-not-ready");
	toggle.setAttribute("aria-hidden", "false");
	toggle.setAttribute("tabindex", "0");
	toggle.disabled = false;

	wrapperRef = wrapper;

	const closePanel = () => {
		wrapper.classList.remove("toc-open");
		toggle.setAttribute("aria-expanded", "false");
		panel.setAttribute("aria-hidden", "true");
		if (document.activeElement && panel.contains(document.activeElement)) {
			toggle.focus({ preventScroll: true });
		}
	};

	const openPanel = () => {
		wrapper.classList.add("toc-open");
		toggle.setAttribute("aria-expanded", "true");
		panel.setAttribute("aria-hidden", "false");
		panel.focus({ preventScroll: true });
	};

	const handleToggle = (event: Event) => {
		event.stopPropagation();
		if (wrapper.classList.contains("toc-open")) {
			closePanel();
		} else {
			openPanel();
		}
	};

	const stopPropagation = (event: Event) => {
		event.stopPropagation();
	};

	const handleOutsideClick = (event: MouseEvent) => {
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (wrapper.contains(target)) return;
		closePanel();
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			closePanel();
		}
	};

	toggle.addEventListener("click", handleToggle);
	panel.addEventListener("click", stopPropagation);
	document.addEventListener("click", handleOutsideClick);
	document.addEventListener("keydown", handleKeydown);
	closePanel();

	cleanupRef = () => {
		toggle.removeEventListener("click", handleToggle);
		panel.removeEventListener("click", stopPropagation);
		document.removeEventListener("click", handleOutsideClick);
		document.removeEventListener("keydown", handleKeydown);
		closePanel();
	};

	closeRef = closePanel;
};
