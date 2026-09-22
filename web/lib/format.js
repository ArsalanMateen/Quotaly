const numberFormatter = new Intl.NumberFormat('en-US');

export const formatNumber = (value) => numberFormatter.format(value);
export const formatMoney = (value) => `$${(value / 1000000).toFixed(6)}`;
export const formatResetDate = (value) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
export const formatEventDate = (value) =>
  new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
