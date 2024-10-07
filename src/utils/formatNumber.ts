const format = new Intl.NumberFormat("en", {
  currency: "NGN",
  style: "currency",
  currencyDisplay: "narrowSymbol",
  currencySign: "accounting",
});

export function formatNaira(amount: number) {
  return format.format(amount);
}
