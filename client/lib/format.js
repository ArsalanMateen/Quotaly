const numberFormatter = new Intl.NumberFormat('en-US');

export const formatNumber = (value) => numberFormatter.format(value);
export const formatMoney = (value) => `$${(value / 1000000).toFixed(6)}`;
