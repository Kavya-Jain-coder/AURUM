const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_CljH3Np6vxQL@ep-muddy-snow-aiywgvcn-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' });
pool.query('SELECT count(*) FROM products', (err, res) => {
  console.log(err ? err : res.rows);
  pool.end();
});
