/**
 * Shared cart helpers — per-kg (qty = kilograms) vs unit (qty = pieces).
 */
(function (global) {
  const PER_KG = "per-kg";
  const UNIT = "unit";

  function isPerKg(item) {
    if (!item) return false;
    if (item.unit === PER_KG) return true;
    if (item.unit === UNIT) return false;
    return false;
  }

  function roundQty(qty, step) {
    const s = step > 0 ? step : 0.5;
    const n = Math.round(qty / s) * s;
    return Math.round(n * 100) / 100;
  }

  function roundMoney(n) {
    return Math.round(n * 100) / 100;
  }

  function getLineTotal(item) {
    return roundMoney((Number(item.price) || 0) * (Number(item.qty) || 0));
  }

  /** Physical kg for delivery fee */
  function getItemWeightKg(item) {
    if (isPerKg(item)) return Number(item.qty) || 0;
    return (Number(item.weight) || 0) * (Number(item.qty) || 0);
  }

  function getCartWeightKg(cart) {
    return (cart || []).reduce((s, i) => s + getItemWeightKg(i), 0);
  }

  function formatQtyLabel(item) {
    const q = Number(item.qty) || 0;
    if (isPerKg(item)) {
      const text = Number.isInteger(q) ? String(q) : String(q);
      return text + " კგ";
    }
    return String(q);
  }

  function formatLineDetail(item) {
    const price = Number(item.price) || 0;
    const total = getLineTotal(item);
    if (isPerKg(item)) {
      return price + " ₾/კგ × " + formatQtyLabel(item) + " = " + total + " ₾";
    }
    return price + " ₾ × " + (Number(item.qty) || 0) + " = " + total + " ₾";
  }

  function getCartCount(cart) {
    return (cart || []).reduce((s, i) => s + (Number(i.qty) || 0), 0);
  }

  function getStep(item) {
    if (isPerKg(item)) return Number(item.step) || 0.5;
    return 1;
  }

  function getMinQty(item) {
    return isPerKg(item) ? getStep(item) : 1;
  }

  function changeItemQty(item, direction) {
    const step = getStep(item);
    const min = getMinQty(item);
    const next = roundQty((Number(item.qty) || 0) + direction * step, step);
    if (next < min - 0.001) return null;
    item.qty = next;
    return item;
  }

  function buildCartItemFromCard(card, visibleName, price) {
    const perKg = card.dataset.pricing === "per-kg";
    const step = Number(card.dataset.step) || 0.5;
    return {
      name: visibleName,
      price: price,
      qty: perKg ? 1 : 1,
      weight: Number(card.dataset.weight) || 0,
      unit: perKg ? PER_KG : UNIT,
      step: perKg ? step : 1,
    };
  }

  function mergeCartItem(cart, newItem) {
    const existing = cart.find(
      (item) =>
        item.name === newItem.name &&
        Number(item.price) === Number(newItem.price) &&
        item.unit === newItem.unit
    );
    if (existing) {
      const add = isPerKg(existing) ? 1 : 1;
      existing.qty = roundQty(
        (Number(existing.qty) || 0) + add,
        getStep(existing)
      );
      return existing;
    }
    cart.push(newItem);
    return newItem;
  }

  global.CartUtils = {
    PER_KG,
    UNIT,
    isPerKg,
    roundQty,
    roundMoney,
    getLineTotal,
    getItemWeightKg,
    getCartWeightKg,
    formatQtyLabel,
    formatLineDetail,
    getCartCount,
    getStep,
    getMinQty,
    changeItemQty,
    buildCartItemFromCard,
    mergeCartItem,
  };
})(typeof window !== "undefined" ? window : global);
