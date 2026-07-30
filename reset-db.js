const { Client } = require('pg');
const fs = require('fs');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres.tmcyscfrojywoosmxguz:pleretpark123@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres'
  });
  
  await client.connect();
  
  try {
    console.log('Dropping PascalCase tables if exist...');
    await client.query('DROP TABLE IF EXISTS "DetailUMKM" CASCADE');
    await client.query('DROP TABLE IF EXISTS "DetailIkan" CASCADE');
    await client.query('DROP TABLE IF EXISTS "Lokasi" CASCADE');
    await client.query('DROP TABLE IF EXISTS "Berita" CASCADE');
    console.log('Dropped PascalCase tables.');
    
    console.log('Running schema.sql to create lowercase tables...');
    const schemaSql = fs.readFileSync('supabase/schema.sql', 'utf8');
    await client.query(schemaSql);
    console.log('Schema executed successfully.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
