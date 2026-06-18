const db = require('./src/db');

async function clean() {
  await db('knex_migrations').del();
  await db('knex_migrations_lock').del();

  console.log('Knex history cleared');
  process.exit();
}

clean();