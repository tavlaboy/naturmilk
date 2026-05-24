(function () {
  const header = document.getElementById("siteNav");
  const toggle = header.querySelector(".nav-toggle");
  const panel = document.getElementById("mobilePanel");

  function setOpen(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.documentElement.classList.toggle("no-scroll", open);
  }

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("is-open"));
  });

  document.addEventListener("click", (e) => {
    if (!header.classList.contains("is-open")) return;
    if (header.contains(e.target)) return; 
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();


document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const mobilePanel = document.getElementById("mobilePanel");

  if (!navToggle || !mobilePanel) return;

  // Close mobile nav when any link inside it is clicked
  mobilePanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        // reuse the existing toggle logic
        navToggle.click();
      }
    });
  });
});
