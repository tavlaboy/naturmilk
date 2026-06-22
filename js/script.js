/* =========================================================
   SAFE UI EFFECTS (won't crash if elements are missing)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // --- Moving text scroller (only if exists)
  const track = document.getElementById("scroller-track");
  const track2 = document.getElementById("scroller-track-2");

  if (track && track2) {
    const updateScroller = (scrollY) => {
      track.style.transform = `translate3d(${-scrollY * 0.5}px, 0, 0)`;
      track2.style.transform = `translate3d(${scrollY * 0.5}px, 0, 0)`;
    };

    window.addEventListener("lenis-scroll", (e) => {
      updateScroller(e.detail.scroll);
    });

    window.addEventListener("scroll", () => {
      updateScroller(window.scrollY || 0);
    }, { passive: true });

    updateScroller(window.scrollY || 0);
  }

  // --- Reviews marquee (only if exists)
  const reviewsSection = document.getElementById("testimonial-slider");
  if (reviewsSection) {
    const track = reviewsSection.querySelector("[data-marquee-track]");
    const group = track?.querySelector(".reviews__group");

    if (track && group) {
      const MARQUEE_SPEED = 38; // px per second — calm but steady

      const clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);

      const setDuration = () => {
        const width = group.getBoundingClientRect().width;
        if (width <= 0) return;
        const duration = width / MARQUEE_SPEED;
        track.style.setProperty("--reviews-marquee-duration", `${duration}s`);
      };

      if (document.fonts?.ready) {
        document.fonts.ready.then(setDuration);
      } else {
        setDuration();
      }

      window.addEventListener("resize", setDuration);
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