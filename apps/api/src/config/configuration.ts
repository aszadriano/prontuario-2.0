export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? '4000', 10),
    corsOrigins:
      process.env.CORS_ORIGINS ?? '*',
    enableSwagger:
      process.env.ENABLE_SWAGGER !== undefined
        ? process.env.ENABLE_SWAGGER !== 'false'
        : true
  },
  database: {
    // Prefer URL if provided, otherwise use discrete fields
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'prontuario',
    ssl:
      process.env.DB_SSL !== undefined
        ? process.env.DB_SSL !== 'false'
        : false,
    sslRejectUnauthorized:
      process.env.DB_SSL_REJECT_UNAUTHORIZED !== undefined
        ? process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
        : undefined
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'super-secret-development-key',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h'
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN
  }
});
