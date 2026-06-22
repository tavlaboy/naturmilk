(function () {
  if (typeof Lenis === "undefined") {
    console.warn("Lenis failed to load — smooth scroll disabled.");
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    initScrollTopFallback();
    return;
  }

  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.6,
    infinite: false,
  });

  window.lenis = lenis;

  lenis.on("scroll", ({ scroll }) => {
    window.dispatchEvent(new CustomEvent("lenis-scroll", { detail: { scroll } }));
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  function getNavOffset() {
    const nav = document.getElementById("siteNav");
    return nav ? -(nav.offsetHeight + 12) : -90;
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target, { offset: getNavOffset() });
    });
  });

  const scrollBtn = document.querySelector(".scroll-btn");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      const target = document.querySelector("#intro") || document.querySelector("#about");
      if (target) {
        lenis.scrollTo(target, { offset: getNavOffset() });
      } else {
        lenis.scrollTo(window.innerHeight * 0.85);
      }
    });
  }

  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      lenis.scrollTo(0);
    });

    lenis.on("scroll", ({ scroll }) => {
      scrollTopBtn.classList.toggle("scroll-top-btn--visible", scroll > 300);
    });
  }

  window.addEventListener("lenis:stop", () => lenis.stop());
  window.addEventListener("lenis:start", () => lenis.start());

  function initScrollTopFallback() {
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (!scrollTopBtn) return;

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });

    window.addEventListener(
      "scroll",
      () => {
        scrollTopBtn.classList.toggle("scroll-top-btn--visible", window.scrollY > 300);
      },
      { passive: true }
    );
  }
})();
