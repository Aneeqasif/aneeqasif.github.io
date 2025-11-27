/**
 * CUSTOM SCRIPT: Image Carousel functionality
 * Safe for upstream merges - doesn't modify theme core
 *
 * Infinite loop carousel with smooth transitions
 */

interface CarouselState {
  currentIndex: number;
  total: number;
  autoplayTimer: number | null;
  isTransitioning: boolean;
  isHovered: boolean;
}

const carouselStates = new Map<string, CarouselState>();

/**
 * Initialize a single carousel
 */
function initCarousel(carousel: HTMLElement): void {
  const id = carousel.dataset.carouselId;
  if (!id || carouselStates.has(id)) return;

  const total = parseInt(carousel.dataset.total || "0", 10);
  if (total === 0) return;

  const autoplay = carousel.dataset.autoplay === "true";
  const interval = parseInt(carousel.dataset.interval || "4000", 10);
  const refIndex = carousel.dataset.ref
    ? parseInt(carousel.dataset.ref, 10) - 1
    : null;

  const state: CarouselState = {
    currentIndex: 0,
    total,
    autoplayTimer: null,
    isTransitioning: false,
    isHovered: false,
  };
  carouselStates.set(id, state);

  const slidesContainer =
    carousel.querySelector<HTMLElement>(".carousel-slides");
  const prevBtn = carousel.querySelector<HTMLButtonElement>(
    "[data-carousel-prev]"
  );
  const nextBtn = carousel.querySelector<HTMLButtonElement>(
    "[data-carousel-next]"
  );
  const caption = carousel.querySelector<HTMLElement>(".carousel-caption");
  const currentSpan = carousel.querySelector<HTMLElement>(".carousel-current");

  if (!slidesContainer) return;

  const originalSlides = Array.from(
    carousel.querySelectorAll<HTMLElement>(".carousel-slide")
  );

  // Clone first and last slides for infinite loop effect
  if (total > 1) {
    const firstClone = originalSlides[0].cloneNode(true) as HTMLElement;
    const lastClone = originalSlides[total - 1].cloneNode(true) as HTMLElement;
    firstClone.setAttribute("data-clone", "first");
    lastClone.setAttribute("data-clone", "last");
    slidesContainer.appendChild(firstClone);
    slidesContainer.insertBefore(lastClone, originalSlides[0]);
  }

  // Start at position 1 (after the prepended last clone)
  let visualIndex = total > 1 ? 1 : 0;

  function getSlideWidth(): number {
    const slide = slidesContainer!.querySelector(".carousel-slide");
    if (!slide) return 0;
    const slideWidth = slide.getBoundingClientRect().width;
    // Get the gap from CSS (default 2rem = 32px)
    const computedStyle = getComputedStyle(slidesContainer!);
    const gap = parseFloat(computedStyle.gap) || 32;
    return slideWidth + gap;
  }

  function setPosition(index: number, animate: boolean = true): void {
    const slideWidth = getSlideWidth();
    const offset = -index * slideWidth;

    if (animate) {
      slidesContainer!.style.transition = "transform 0.4s ease-out";
    } else {
      slidesContainer!.style.transition = "none";
    }

    slidesContainer!.style.transform = `translateX(${offset}px)`;
  }

  function updateUI(): void {
    if (caption) {
      const img = originalSlides[state.currentIndex]?.querySelector("img");
      caption.textContent = img?.getAttribute("alt") || "";
    }

    if (currentSpan) {
      currentSpan.textContent = String(state.currentIndex + 1);
    }
  }

  function goToSlide(newIndex: number, direction: "next" | "prev"): void {
    if (state.isTransitioning) return;

    state.isTransitioning = true;

    // Calculate target visual index
    if (direction === "next") {
      visualIndex++;
    } else {
      visualIndex--;
    }

    setPosition(visualIndex, true);

    // Update logical index (wrapping)
    state.currentIndex = newIndex;
    if (state.currentIndex < 0) state.currentIndex = total - 1;
    if (state.currentIndex >= total) state.currentIndex = 0;

    updateUI();

    // After transition, check if we need to jump to the real slide
    setTimeout(() => {
      // If we're on the first clone (after last real slide), jump to real first
      if (visualIndex >= total + 1) {
        visualIndex = 1;
        setPosition(visualIndex, false);
      }
      // If we're on the last clone (before first real slide), jump to real last
      else if (visualIndex <= 0) {
        visualIndex = total;
        setPosition(visualIndex, false);
      }

      state.isTransitioning = false;
    }, 420);
  }

  function nextSlide(): void {
    goToSlide(state.currentIndex + 1, "next");
  }

  function prevSlide(): void {
    goToSlide(state.currentIndex - 1, "prev");
  }

  function startAutoplay(): void {
    if (!autoplay || state.autoplayTimer || state.isHovered) return;
    state.autoplayTimer = window.setInterval(nextSlide, interval);
  }

  function stopAutoplay(): void {
    if (state.autoplayTimer) {
      clearInterval(state.autoplayTimer);
      state.autoplayTimer = null;
    }
  }

  function resetAutoplay(): void {
    if (!autoplay) return;
    stopAutoplay();
    // Only restart if not hovered
    if (!state.isHovered) {
      startAutoplay();
    }
  }

  /**
   * Set carousel dimensions based on images
   */
  function setDimensions(): void {
    const images = carousel.querySelectorAll<HTMLImageElement>(
      ".carousel-slide:not([data-clone]) img"
    );
    if (images.length === 0) return;

    // Read scale from CSS custom property
    const scale = parseFloat(
      getComputedStyle(carousel).getPropertyValue("--carousel-scale") || "1"
    );

    let targetWidth = 0;
    let targetHeight = 0;

    if (refIndex !== null && refIndex >= 0 && refIndex < images.length) {
      const refImg = images[refIndex];
      if (refImg.naturalWidth > 0) {
        targetWidth = refImg.naturalWidth;
        targetHeight = refImg.naturalHeight;
      }
    }

    if (targetWidth === 0 || targetHeight === 0) {
      images.forEach((img) => {
        if (img.naturalWidth > targetWidth) {
          targetWidth = img.naturalWidth;
        }
        if (img.naturalHeight > targetHeight) {
          targetHeight = img.naturalHeight;
        }
      });
    }

    if (targetWidth > 0 && targetHeight > 0) {
      const maxWidth = carousel.parentElement?.clientWidth || window.innerWidth;
      const maxHeight = window.innerHeight * 0.7;

      let finalWidth = Math.min(targetWidth, maxWidth);
      let finalHeight = targetHeight * (finalWidth / targetWidth);

      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = targetWidth * (finalHeight / targetHeight);
      }

      // Apply scale factor
      finalWidth = finalWidth * scale;
      finalHeight = finalHeight * scale;

      carousel.style.width = `${finalWidth}px`;
      slidesContainer!.style.height = `${finalHeight}px`;

      // Re-set position after dimension change
      setPosition(visualIndex, false);
    }
  }

  function initDimensions(): void {
    const images = carousel.querySelectorAll<HTMLImageElement>(
      ".carousel-slide:not([data-clone]) img"
    );
    let loadedCount = 0;
    const totalImages = images.length;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalImages) {
        setDimensions();
      }
    };

    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        checkAllLoaded();
      } else {
        img.addEventListener("load", checkAllLoaded, { once: true });
        img.addEventListener("error", checkAllLoaded, { once: true });
      }
    });

    if (totalImages === 0) {
      setDimensions();
    }
  }

  // Event handlers
  prevBtn?.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });

  carousel.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
      resetAutoplay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
      resetAutoplay();
    }
  });

  if (autoplay) {
    carousel.addEventListener("mouseenter", () => {
      state.isHovered = true;
      stopAutoplay();
    });
    carousel.addEventListener("mouseleave", () => {
      state.isHovered = false;
      startAutoplay();
    });
    carousel.addEventListener("focusin", () => {
      state.isHovered = true;
      stopAutoplay();
    });
    carousel.addEventListener("focusout", (e: FocusEvent) => {
      if (!carousel.contains(e.relatedTarget as Node)) {
        state.isHovered = false;
        startAutoplay();
      }
    });
  }

  // Touch/swipe support
  let touchStartX = 0;
  const minSwipeDistance = 50;

  carousel.addEventListener(
    "touchstart",
    (e: TouchEvent) => {
      touchStartX = e.changedTouches[0]?.screenX || 0;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0]?.screenX || 0;
      const swipeDistance = touchEndX - touchStartX;

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
        resetAutoplay();
      }
    },
    { passive: true }
  );

  if (!carousel.hasAttribute("tabindex")) {
    carousel.setAttribute("tabindex", "0");
  }

  // Initialize
  initDimensions();
  setPosition(visualIndex, false);

  let resizeTimer: number | null = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      setDimensions();
    }, 200);
  });

  if (autoplay) {
    startAutoplay();
  }
}

function initAllCarousels(): void {
  const carousels = document.querySelectorAll<HTMLElement>(
    ".carousel[data-carousel-id]"
  );
  carousels.forEach(initCarousel);
}

function cleanupCarousels(): void {
  carouselStates.forEach((state) => {
    if (state.autoplayTimer) {
      clearInterval(state.autoplayTimer);
    }
  });
  carouselStates.clear();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAllCarousels);
} else {
  initAllCarousels();
}

document.addEventListener("swup:contentReplaced", () => {
  cleanupCarousels();
  initAllCarousels();
});

document.addEventListener("astro:page-load", () => {
  cleanupCarousels();
  initAllCarousels();
});

export { initAllCarousels, cleanupCarousels };
