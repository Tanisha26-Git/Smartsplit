// Single place for money formatting so the whole app uses one currency symbol.
// Change CURRENCY here to switch (e.g. "$") everywhere at once.
const CURRENCY = "₹";

export const formatMoney = (n) => `${CURRENCY}${Number(n || 0).toFixed(2)}`;
