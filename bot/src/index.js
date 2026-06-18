const express = require('express');
const bot = require('./bot');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL;

// Parse incoming JSON request updates sent by Telegram's webhook
app.use(express.json());

// Basic web endpoint to check if your server layer is working
app.get('/', (req, res) => {
  res.send('Alif Bank ATM Support Server is running smoothly.');
});

// Mount the Telegraf webhook middleware route handler
app.use(bot.webhookCallback(`/bot${process.env.BOT_TOKEN}`));

// Start the Express server layer
app.listen(PORT, async () => {
  console.log(`🚀 Server listening on local port: ${PORT}`);

  // Auto-register the public address url callback route with Telegram
  if (SERVER_URL && SERVER_URL.startsWith('https')) {
    try {
      await bot.telegram.setWebhook(`${SERVER_URL}/bot${process.env.BOT_TOKEN}`);
      console.log(`🔗 Telegram Webhook mapped successfully to: ${SERVER_URL}`);
    } catch (error) {
      console.error('❌ Failed to establish Telegram Webhook binding:', error);
    }
  } else {
    console.log('⚠️ SERVER_URL is missing or not HTTPS. Run a proxy tunnel like localtunnel or ngrok to link your local port with Telegram.');
  }
});
