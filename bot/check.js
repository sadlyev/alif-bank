const db = require('./src/db');

async function verify() {
  try {
    const res = await db('atms').count('atm_number as total').first();
    console.log(`\n📊 DATABASE CHECK: Total Rows inside 'atms' table = ${res.total}\n`);
    
    if (parseInt(res.total) > 0) {
      const sample = await db('atms').select('*').limit(2);
      console.log('👀 Sample Records:', sample);
    } else {
      console.log('⚠️ The table exists but contains 0 rows.');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Database Connection Error:', err.message);
    process.exit(1);
  }
}
verify();
