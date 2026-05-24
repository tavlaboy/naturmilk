/* =========================================================
   SAFE UI EFFECTS (won't crash if elements are missing)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // --- Moving text scroller (only if exists)
  const track = document.getElementById("scroller-track");
  const track2 = document.getElementById("scroller-track-2");

  if (track && track2) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY || 0;
      track.style.transform = `translateX(${-scrollY * 0.5}px)`;
      track2.style.transform = `translateX(${scrollY * 0.5}px)`;
    });
  }

  // --- Testimonials slider (only if exists)
  const slider = document.getElementById("testimonial-slider");
  if (slider) {
    const trackEl = slider.querySelector("[data-track]");
    const prev = slider.querySelector("[data-prev]");
    const next = slider.querySelector("[data-next]");

    if (trackEl && prev && next) {
      const slides = Array.from(trackEl.children);

      let index = 0;
      let perView = getPerView();
      let gapPx = getGap();
      let slideWidth = 0;
      let maxIndex = Math.max(0, slides.length - perView);

      function getPerView() {
        const val = getComputedStyle(document.documentElement)
          .getPropertyValue("--per-view")
          .trim();
        const n = parseInt(val, 10);
        return Number.isFinite(n) && n > 0 ? n : 1;
      }

      function getGap() {
        const g = getComputedStyle(trackEl).gap || "0px";
        const n = parseFloat(g);
        return Number.isFinite(n) ? n : 0;
      }

      function layout() {
        perView = getPerView();
        gapPx = getGap();

        const trackWidth = trackEl.clientWidth || 0;
        if (trackWidth <= 0) return;

        slideWidth = (trackWidth - gapPx * (perView - 1)) / perView;
        slides.forEach((s) => (s.style.width = `${slideWidth}px`));

        maxIndex = Math.max(0, slides.length - perView);
        index = Math.min(index, maxIndex);
        move();
        updateButtons();
      }

      function move() {
        const offset = index * (slideWidth + gapPx);
        trackEl.style.transform = `translate3d(${-offset}px,0,0)`;
      }

      function updateButtons() {
        prev.disabled = index === 0;
        next.disabled = index === maxIndex;
      }

      prev.addEventListener("click", () => {
        if (index > 0) {
          index--;
          move();
          updateButtons();
        }
      });

      next.addEventListener("click", () => {
        if (index < maxIndex) {
          index++;
          move();
          updateButtons();
        }
      });

      let startX = null;
      trackEl.addEventListener(
        "touchstart",
        (e) => {
          startX = e.touches[0].clientX;
        },
        { passive: true }
      );

      trackEl.addEventListener("touchend", (e) => {
        if (startX == null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
          if (dx < 0 && index < maxIndex) index++;
          else if (dx > 0 && index > 0) index--;
          move();
          updateButtons();
        }
        startX = null;
      });

      window.addEventListener("resize", layout);
      layout();
    }
  }

  // Update cart bubble on every page load
  updateNavbarCartCount();
});

/* =========================================================
   CART (LocalStorage) — FIXED VARIANTS (200გრ != 1კგ)
   ========================================================= */

// Read cart
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    return [];
  }
}

// Save cart
function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart || []));
  updateNavbarCartCount();
}

// IMPORTANT: This key prevents merging different sizes.
// If name includes "200გრ" or "1კგ", they stay separate.
function makeCartKey(name, price) {
  return `${String(name).trim()}__${Number(price) || 0}`;
}

// Global function for your product buttons:
// onclick="addToCart('სულგუნის ჩხირები 200გრ', 6)"
window.addToCart = function (name, price) {
  const cleanName = String(name || "").trim();
  const cleanPrice = Number(price) || 0;

  if (!cleanName || cleanPrice <= 0) {
    alert("პროდუქტის დამატება ვერ მოხერხდა (არასწორი სახელი ან ფასი).");
    return;
  }

  const cart = getCart();
  const key = makeCartKey(cleanName, cleanPrice);

  const found = cart.find((i) => i && i.key === key);

  if (found) {
    found.qty = (Number(found.qty) || 0) + 1;
  } else {
    cart.push({
      key: key,
      name: cleanName,   // keeps exact "200გრ" text
      price: cleanPrice,
      qty: 1,
    });
  }

  setCart(cart);

  // Optional nice message
  // alert("დამატებულია კალათაში ✅");
};

// Optional helpers
window.clearCart = function () {
  localStorage.removeItem("cart");
  updateNavbarCartCount();
};

window.updateNavbarCartCount = updateNavbarCartCount;

// Bubble updater (safe)
function updateNavbarCartCount() {
  const bubble = document.getElementById("cartBubble");
  if (!bubble) return;

  const cart = getCart();
  const count =
    typeof CartUtils !== "undefined"
      ? CartUtils.getCartCount(cart)
      : cart.reduce((s, i) => s + (Number(i.qty) || 0), 0);
  bubble.textContent = count; 
}