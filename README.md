# Quotaly

Quotaly connects real Google Gemini text generation to usage metering, monthly plan limits, cost estimates, usage history, and Stripe billing.

## Configure Gemini

1. Create an API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Copy `server/.env.example` to `server/.env`.
3. Set `GEMINI_API_KEY` in `server/.env`. Optionally set `GEMINI_MODEL` (defaults to `gemini-2.5-flash`).
4. Configure `MONGODB_URI` and any Stripe variables needed for billing.
5. Start the API from the `server` directory with `npm start`.

The Gemini key is read only by the server. Do not put it in client environment variables, commit it, or return it to the browser. In production, configure it as a secret in your hosting platform.

## Generation and metering

The workspace sends a prompt and maximum output token setting to the server. The server checks the tenant, subscription, idempotency key, and monthly quotas; asks Gemini to count prompt tokens; limits output to the remaining allowance; then records provider-reported input/output usage, model, and estimated cost. A repeated request with the same idempotency key and payload returns the stored result without charging again. A reused key with a different payload returns a conflict.

Gemini pricing is configured in `server/modules/metering/pricing.js` using published standard text-token rates. Verify rates against [Google's pricing page](https://ai.google.dev/gemini-api/docs/pricing) before deployment and update the pricing version when rates change. Metered costs are estimates based on token usage and configured rates, not a replacement for the Google Cloud billing statement.

## Billing and quotas

Monthly usage resets on the first day of each month in UTC. The Free and Pro plans retain separate API-call and token allowances. Stripe Checkout remains available when billing credentials are configured. Sandbox reset clears sandbox usage and activity.

## Tests

From `server`, run `npm test`.

## License

This project is licensed under the [MIT](LICENSE) License.
