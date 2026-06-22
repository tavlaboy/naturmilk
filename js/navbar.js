(function () {
  const header = document.getElementById("siteNav");
  if (!header) return;

  const toggle = header.querySelector(".nav-toggle");
  const panel = document.getElementById("mobilePanel");
  const backdrop = document.getElementById("mobileBackdrop");

  function syncMobileNavHeight() {
    const inner = header.querySelector(".nav-inner");
    if (!inner) return;
    header.style.setProperty("--mobile-bar-h", `${inner.offsetHeight}px`);
  }

  function setOpen(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "მენიუს დახურვა" : "მენიუს გახსნა");
    document.documentElement.classList.toggle("no-scroll", open);

    if (backdrop) {
      backdrop.setAttribute("aria-hidden", String(!open));
    }

    if (window.lenis) {
      if (open) window.lenis.stop();
      else window.lenis.start();
    }
  }

  syncMobileNavHeight();
  window.addEventListener("resize", syncMobileNavHeight);
  window.addEventListener("load", syncMobileNavHeight);

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("is-open"));
  });

  backdrop?.addEventListener("click", () => setOpen(false));

  document.addEventListener("click", (e) => {
    if (!header.classList.contains("is-open")) return;
    if (header.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  panel?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
      }
    });
  });
})();
