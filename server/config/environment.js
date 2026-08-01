export function configuration(env = process.env) {
  return {
    port: Number(env.PORT),
    host: env.HOST,
    production: env.NODE_ENV === 'production',
  };
}
