(function () {
  const video = document.querySelector("video.hero-img");
  if (!video) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.removeAttribute("poster");

  const markReady = () => {
    if (video.classList.contains("is-ready")) return;
    video.classList.add("is-ready");
    video.removeAttribute("poster");
  };

  const tryPlay = () => {
    if (prefersReducedMotion || !isHeroVisible()) return;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  const pauseVideo = () => {
    if (!video.paused) video.pause();
  };

  function isHeroVisible() {
    const rect = video.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }

  video.addEventListener("loadeddata", markReady, { once: true });
  video.addEventListener("canplay", markReady, { once: true });
  video.addEventListener("waiting", () => video.removeAttribute("poster"));
  video.addEventListener("playing", () => {
    markReady();
    video.removeAttribute("poster");
  });

  if (prefersReducedMotion) {
    video.removeAttribute("autoplay");
    video.preload = "metadata";
    video.pause();
    return;
  }

  video.preload = "auto";

  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    markReady();
    tryPlay();
  } else {
    video.addEventListener("canplay", tryPlay, { once: true });
  }

  const heroObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible) tryPlay();
      else pauseVideo();
    },
    { threshold: 0.05 }
  );

  heroObserver.observe(video);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseVideo();
    else tryPlay();
  });
})();
