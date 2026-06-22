(function () {
  const video = document.querySelector("video.hero-img");
  if (!video) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  if (prefersReducedMotion || isMobile) {
    video.removeAttribute("autoplay");
    video.preload = "none";
    video.pause();
    return;
  }

  const tryPlay = () => {
    if (!isHeroVisible()) return;
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

  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
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
