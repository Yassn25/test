const { Pool } = require('pg');

const connectionString = process.env.DB_URL;

if (!connectionString) {
  console.warn(
    '[database] DB_URL env variable not set. Database queries will fail until it is provided.'
  );
}

const pool = new Pool({
  connectionString,
  max: Number(process.env.DB_MAX_CLIENTS || 10),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT || 30000),
  ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
      : undefined,
});

pool.on('error', (error) => {
  console.error('[database] Unexpected error on idle client', error);
});

const testConnection = async () => {
  if (!connectionString) {
    return;
  }

  try {
    await pool.query('SELECT NOW()');
    console.log('[database] Connection pool initialised');
  } catch (error) {
    console.error('[database] Failed to establish initial connection', error);
  }
};

testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
