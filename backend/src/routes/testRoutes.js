const express = require("express");
const pool = require("../config/database");
const router = express.Router();

router.get('/db-test', async (req, res) => {
  try {
    // Teste 1: Verificar se as variáveis existem
    console.log('=== CONEXÃO DB ===');
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_PASSWORD existe?', !!process.env.DB_PASSWORD);
    
    // Teste 2: Tentar conectar manualmente
    const client = await pool.connect();
    console.log('✅ Conectou no PostgreSQL!');
    
    const result = await client.query('SELECT NOW() as time');
    client.release();
    
    res.json({ db: 'conectado', time: result.rows[0].time });
  } catch (err) {
    console.error('❌ ERRO COMPLETO:');
    console.error('Mensagem:', err.message);
    console.error('Código:', err.code);
    console.error('Stack:', err.stack);
    
    res.status(500).json({ 
      error: err.message,
      code: err.code,
      details: err.toString()
    });
  }
});

module.exports = router;
