
export const config = {
  server: {
    port: 5001,
    host: '0.0.0.0'
  },
  auth: {
    sessionSecret: process.env.SESSION_SECRET || 'votre-secret-par-defaut',
    tokenExpiration: '24h'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }
};
