import 'dotenv/config';
import { Client, ClientConfig } from 'pg';

const getSslOption = () => {
  const sslEnv = process.env.DB_SSL;
  const rejectEnv = process.env.DB_SSL_REJECT_UNAUTHORIZED;
  const sslEnabled = sslEnv !== undefined ? sslEnv !== 'false' : false;
  if (!sslEnabled) return false as const;
  if (rejectEnv === 'false') {
    return { rejectUnauthorized: false } as unknown as ClientConfig['ssl'];
  }
  return true as const;
};

const buildAdminConfig = (): ClientConfig => {
  const ssl = getSslOption();
  const url = process.env.DATABASE_URL;
  const adminDb = process.env.PGADMIN_DB || 'postgres';
  if (url) {
    const u = new URL(url);
    u.pathname = `/${adminDb}`;
    return { connectionString: u.toString(), ssl };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: adminDb,
    ssl
  };
};

async function ensureDatabase() {
  const dbName = process.env.DB_NAME || 'prontuario';
  const cfg = buildAdminConfig();
  const client = new Client(cfg);
  try {
    await client.connect();
    const check = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (check.rowCount && check.rowCount > 0) {
      console.log(`Database '${dbName}' already exists.`);
      return;
    }
    const ident = '"' + dbName.replace(/"/g, '""') + '"';
    await client.query(`CREATE DATABASE ${ident} ENCODING 'UTF8'`);
    console.log(`Database '${dbName}' created.`);
  } catch (err) {
    console.error('Failed to ensure database exists', err);
    throw err;
  } finally {
    try {
      await client.end();
    } catch {}
  }
}

if (require.main === module) {
  ensureDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

