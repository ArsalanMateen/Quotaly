import { useEffect, useState } from 'react';
import { Notice } from '../../components/ui/Notice.jsx';

export function CheckoutNotice({ outcome, page, onDismiss }) {
  const supported = ['success', 'canceled'].includes(outcome);
  const [expiresAt] = useState(() => Date.now() + 5000);

  useEffect(() => {
    if (!supported) return;
    const url = new URL(window.location.href);

    url.searchParams.delete('checkout');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [outcome, supported]);

  if (!supported || (page && page !== 'overview')) return null;

  return (
    <Notice expiresAt={expiresAt} onDismiss={onDismiss}>
      {outcome === 'success'
        ? 'Checkout completed.'
        : 'Checkout canceled. Your current plan remains available.'}
    </Notice>
  );
}
