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

// 2. LIGHTWEIGHT PINGER ROUTE FOR CRON-JOB.ORG
app.get('/sync-cron', (req, res) => {
  console.log('📶 Cron pinger received. Keeping server awake!');
  res.status(200).send('OK'); 
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
