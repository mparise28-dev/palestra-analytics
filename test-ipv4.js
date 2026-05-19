const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '123abc',
  host: 'localhost',
  port: 2968,
  database: 'bdpalestra',
});

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Conectou!', res.rows[0]);
  } catch (err) {
    console.log('❌ Erro:', err.message);
  }
}

test();