const express = require('express');
const bot = require('./bot');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Alif Bank ATM Support Server is running locally.');
});

// Seed data array directly inside the execution environment
const atmList = [
  { atm_number: '22538', name: 'Yunusobod 2-1' },
  { atm_number: '23987', name: "Xalqlar Do'stligi 1-4" },
  { atm_number: '24428', name: 'Novza 2-1' },
  { atm_number: '22223', name: "Buyuk Ipak Yo'li 1-2" },
  { atm_number: '24932', name: 'Mirzo Ulugbek 1-3' },
  { atm_number: '24869', name: 'Mirzo Ulugbek 1-2' },
  { atm_number: '25373', name: "Buyuk Ipak Yo'li 2-4" },
  { atm_number: '25247', name: "Buyuk Ipak Yo'li 2-2" },
  { atm_number: '25184', name: "Buyuk Ipak Yo'li 2-1" },
  { atm_number: '25058', name: "Mirzo Ulug'bek 2-3" },
  { atm_number: '24806', name: "Mirzo Ulug'bek 1-1" },
  { atm_number: '24995', name: "Mirzo Ulug'bek 1-4" },
  { atm_number: '25121', name: "Mirzo Ulug'bek 2-4" },
  { atm_number: '24743', name: 'Choshtepa 2-2' },
  { atm_number: '24365', name: 'Novza 1-1' },
  { atm_number: '24617', name: 'Novza 2-4' },
  { atm_number: '24554', name: 'Novza 2-3' },
  { atm_number: '24491', name: 'Novza 2-2' },
  { atm_number: '25310', name: "Buyuk Ipak Yo'li 2-3" },
  { atm_number: '24680', name: 'Yangihayot 1-3' },
  { atm_number: '24302', name: 'Paxtakor 1-3' },
  { atm_number: '24113', name: 'Beruniy 2-2' },
  { atm_number: '24050', name: 'Beruniy 2-1' },
  { atm_number: '24176', name: 'Beruniy 2-3' },
  { atm_number: '24239', name: 'Beruniy 2-4' },
  { atm_number: '22601', name: 'Yunusobod 2-2' },
  { atm_number: '23861', name: 'Olmazor 2-4' },
  { atm_number: '23798', name: 'Olmazor 2-3' },
  { atm_number: '23735', name: 'Olmazor 2-2' },
  { atm_number: '23672', name: 'Olmazor 2-1' },
  { atm_number: '23924', name: "Xalqlar Do'stligi 1-3" },
  { atm_number: '23168', name: 'Chilonzor 2-1' },
  { atm_number: '23420', name: 'Chilonzor 1-1' },
  { atm_number: '23483', name: 'Chilonzor 1-2' },
  { atm_number: '23546', name: 'Chilonzor 1-3' },
  { atm_number: '23609', name: 'Chilonzor 1-4' },
  { atm_number: '23357', name: 'Chilonzor 2-4' },
  { atm_number: '23294', name: 'Chilonzor 2-3' },
  { atm_number: '23231', name: 'Chilonzor 2-2' },
  { atm_number: '23105', name: 'Minor 2-2' },
  { atm_number: '22664', name: 'Abdulla Qodiriy 2-1' },
  { atm_number: '22979', name: 'Tinchlik 2-2' },
  { atm_number: '22853', name: "Halqlar do'stligi 1-2" },
  { atm_number: '22916', name: 'Hamid olimjon metrosi 2-2' },
  { atm_number: '22790', name: "Halqlar do'stligi 1-1" },
  { atm_number: '22475', name: 'Hamid olimjon metrosi 1-2' },
  { atm_number: '22412', name: 'Hamid olimjon metrosi 1-1' },
  { atm_number: '22160', name: "Buyuk Ipak yo'li 1-1" },
  { atm_number: '22349', name: "Buyuk Ipak yo'li 1-4" },
  { atm_number: '22286', name: "Buyuk Ipak yo'li 1-3" },
  { atm_number: '19829', name: 'Yangihayot 1-2' },
  { atm_number: '19766', name: 'Yangihayot 1-1' },
  { atm_number: '20018', name: 'Sergeli 1-3' },
  { atm_number: '19955', name: 'Sergeli 1-2' },
  { atm_number: '20081', name: "O'zgarish 1-1" },
  { atm_number: '21404', name: 'Shahriston 2-1' },
  { atm_number: '22034', name: 'Amir Temur xiyoboni 2-2' },
  { atm_number: '20711', name: 'Pushkin metrosi 1-2' },
  { atm_number: '20648', name: 'Pushkin metrosi 1-1' },
  { atm_number: '20900', name: 'Toshkent 1-1' },
  { atm_number: '20144', name: "O'zgarish 1-2" },
  { atm_number: '20333', name: 'Choshtepa 1-3' },
  { atm_number: '20270', name: 'Choshtepa 1-2' },
  { atm_number: '20207', name: 'Choshtepa 1-1' },
  { atm_number: '20522', name: 'Amir Temur xiyoboni 2-1' },
  { atm_number: '20963', name: 'Toshkent 1-2' },
  { atm_number: '21971', name: 'Turkiston 1-3' },
  { atm_number: '21908', name: 'Turkiston 1-1' },
  { atm_number: '21152', name: "G'afur G'ulom 1-1" },
  { atm_number: '21215', name: "G'afur G'ulom 1-2" },
  { atm_number: '21278', name: "G'afur G'ulom 1-3" },
  { atm_number: '21845', name: 'Bodomzor metrosi 2-2' },
  { atm_number: '21719', name: "Do'stlik 2-1" },
  { atm_number: '21782', name: "Do'stlik 2-2" },
  { atm_number: '21467', name: 'Shahriston metrosi 2-2' },
  { atm_number: '21656', name: 'Turkiston 1-2' },
  { atm_number: '20459', name: 'Mustaqillik maydoni 2-2' },
  { atm_number: '21089', name: 'Oybek' },
  { atm_number: '17309', name: "Milliy Bog' 1-1" },
  { atm_number: '21026', name: 'Oybek metrosi 2-1' },
  { atm_number: '20396', name: 'Mustaqillik maydoni 2-1' },
  { atm_number: '19892', name: 'Sergeli 1-1' },
  { atm_number: '19703', name: 'Mashinasozlar 2-2' },
  { atm_number: '19640', name: 'Mashinasozlar 1-2' },
  { atm_number: '19577', name: "O'zbekiston 2-1" },
  { atm_number: '19451', name: "G'afur G'ulom 2-2" },
  { atm_number: '17372', name: 'Milliy Bog’ 1-2' },
  { atm_number: '19514', name: "O'zbekiston 1-2" },
  { atm_number: '17246', name: "Milliy bog' 2" },
  { atm_number: '16553', name: 'Pushkin metrosi 2' },
  { atm_number: '17057', name: 'Kosmonavtlar 4' },
  { atm_number: '16868', name: 'Chorsu 2-1' },
  { atm_number: '17183', name: 'Choshtepa' },
  { atm_number: '16301', name: "G'afur G'ulom" },
  { atm_number: '17120', name: 'Mashinasozlar 1-1' },
  { atm_number: '16994', name: 'Tinchlik metrosi' },
  { atm_number: '13907', name: 'Yangiobod' },
  { atm_number: '16931', name: 'Chorsu 2-2' },
  { atm_number: '16805', name: 'Alisher Navoi 2' },
  { atm_number: '16742', name: 'Alisher Navoi' },
  { atm_number: '16364', name: 'Bodomzor metrosi 3' },
  { atm_number: '16679', name: 'Qipchoq 2' },
  { atm_number: '16616', name: 'Qipchoq' },
  { atm_number: '14411', name: 'Quruvchilar' },
  { atm_number: '14474', name: 'Quruvchilar 2' },
  { atm_number: '14852', name: 'Rohat 2' },
  { atm_number: '14348', name: 'Xonobod 2' },
  { atm_number: '14285', name: 'Xonobod' },
  { atm_number: '14159', name: 'Tolariq 2' },
  { atm_number: '14222', name: 'Tolariq' },
  { atm_number: '16175', name: "O'zbekiston 2" },
  { atm_number: '14915', name: 'Yashnobod' },
  { atm_number: '13970', name: 'Yangiobod 2' },
  { atm_number: '16238', name: 'Mashinasozlar' },
  { atm_number: '15608', name: 'Abdulla Qodiriy metrosi 3' },
  { atm_number: '15734', name: 'Minor metrosi 3' },
  { atm_number: '16490', name: 'Novza 2' },
  { atm_number: '16427', name: 'Novza' },
  { atm_number: '16112', name: "Milliy bog'" },
  { atm_number: '16049', name: "Halqlar do'stligi 2" },
  { atm_number: '15419', name: "O'zbekiston" },
  { atm_number: '15986', name: 'Toshkent metrosi 2' },
  { atm_number: '15923', name: 'Paxtakor metrosi 4' },
  { atm_number: '15860', name: 'Tinchlik metrosi 2' },
  { atm_number: '15797', name: 'Bodomzor metrosi 2' },
  { atm_number: '15482', name: 'Shahriston metrosi 2' },
  { atm_number: '15671', name: 'Minor metrosi 2' },
  { atm_number: '15545', name: 'Abdulla Qodiriy metrosi 2' },
  { atm_number: '15230', name: 'Amir Temur xiyoboni 2' },
  { atm_number: '15356', name: 'Kosmonavtlar 3' },
  { atm_number: '15293', name: 'Kosmonavtlar 2' },
  { atm_number: '15167', name: 'Mustaqillik maydoni 2' },
  { atm_number: '13781', name: 'Olmos' },
  { atm_number: '13844', name: 'Olmos 2' },
  { atm_number: '15041', name: 'Tuzel' },
  { atm_number: '15104', name: 'Tuzel 2' },
  { atm_number: '14978', name: 'Yashnobod 2' },
  { atm_number: '13718', name: 'Texnopark 2' },
  { atm_number: '13655', name: 'Texnopark' },
  { atm_number: '13403', name: 'Turon' },
  { atm_number: '14726', name: "Qo'yliq 2" },
  { atm_number: '14663', name: "Qo'yliq" },
  { atm_number: '14096', name: 'Matonat 2' },
  { atm_number: '14033', name: 'Matonat' },
  { atm_number: '14789', name: 'Rohat' },
  { atm_number: '14600', name: 'Qiyot 2' },
  { atm_number: '14537', name: 'Qiyot' },
  { atm_number: '13466', name: 'Turon 2' },
  { atm_number: '13529', name: 'Paxtakor metrosi 2' },
  { atm_number: '13592', name: 'Paxtakor metrosi 3' },
  { atm_number: '13340', name: 'Yangihayot 1-5' },
  { atm_number: '13277', name: 'Yangihayot 1-4' },
  { atm_number: '13214', name: "Ming o'rik" },
  { atm_number: '13088', name: 'Yunusobod 2' },
  { atm_number: '13025', name: 'Turkiston 2' },
  { atm_number: '12962', name: 'Do\'stlik metrosi 2' },
  { atm_number: '12899', name: 'Chorsu 2' },
  { atm_number: '12836', name: 'Beruniy 2' },
  { atm_number: '12773', name: 'Oybek metrosi 2' },
  { atm_number: '12710', name: 'Novza 2' },
  { atm_number: '12647', name: "Mirzo ulug'bek metrosi 2" },
  { atm_number: '12143', name: 'Olmazor 2' },
  { atm_number: '12584', name: 'Kosmonavtlar' },
  { atm_number: '12521', name: 'Beruniy' },
  { atm_number: '12458', name: 'Turkiston' },
  { atm_number: '12395', name: 'Yunusobod' },
  { atm_number: '12332', name: 'Чорсу' },
  { atm_number: '12269', name: 'Amir Temur xiyoboni' },
  { atm_number: '12206', name: 'Mustaqillik maydoni' },
  { atm_number: '12080', name: 'Olmazor 1' },
  { atm_number: '12017', name: 'Novza' },
  { atm_number: '11954', name: "Ming o'rik" },
  { atm_number: '11891', name: 'Hamid olimjon metrosi' },
  { atm_number: '11828', name: 'Pushkin metrosi' },
  { atm_number: '11324', name: 'Shahriston metrosi' },
  { atm_number: '11765', name: 'Bodomzor metrosi' },
  { atm_number: '11702', name: "Do'stlik metrosi" },
  { atm_number: '11639', name: 'Toshkent metrosi' },
  { atm_number: '11576', name: 'Oybek metrosi' },
  { atm_number: '11513', name: 'Tinchlik metrosi' },
  { atm_number: '11450', name: 'Paxtakor metrosi' },
  { atm_number: '11198', name: 'Minor metrosi' },
  { atm_number: '11261', name: 'Abdulla Qodiriy metrosi' },
  { atm_number: '11135', name: "Mirzo Ulug'bek 1-1" },
  { atm_number: '10127', name: "Toshkent, Shayhontoxur" },
  { atm_number: '10820', name: "Halqlar do'stligi"}
];
// 1. THIS RUNS ONLY ONCE WHEN THE SERVER STARTS
app.listen(PORT, async () => {
  console.log(`🚀 Express server listening on local port: ${PORT}`);
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    bot.launch();
    console.log('🤖 Telegram Bot is online using Long Polling!');
  } catch (error) {
    console.error('❌ Failed to launch bot:', error);
  }
});

// 2. CREATE A DEDICATED ROUTE FOR YOUR CRON JOB
app.get('/sync-cron', async (req, res) => {
  try {
    // Send a 200 OK immediately so cron-job.org finishes successfully
    res.status(200).send('Sync started'); 

    // Run the heavy database work asynchronously in the background
    const cleanList = [];
    const seenIds = new Set();
    for (const item of atmList) {
      if (!seenIds.has(item.atm_number)) {
        seenIds.add(item.atm_number);
        cleanList.push(item);
      }
    }

    await db('atms').insert(cleanList).onConflict('atm_number').merge();
    console.log(`📦 Internal Sync complete: ${cleanList.length} ATMs updated.`);

  } catch (err) {
    console.error('❌ Sync failed:', err);
    // Don't send the error to the cron service if it's too large
    if (!res.headersSent) res.status(500).send('Error'); 
  }
});


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
