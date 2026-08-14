export function configuration(env = process.env) {
  return {
    port: Number(env.PORT),
    host: env.HOST,
    production: env.NODE_ENV === 'production',
    mongoUri: env.MONGODB_URI,
    stripeKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    proPriceId: env.STRIPE_PRO_PRICE_ID,
  };
}
