const { Telegraf, Scenes } = require('telegraf');
const { session } = require('@telegraf/session');
const supportWizard = require('./scenes/supportWizard');
require('dotenv').config();

if (!process.env.BOT_TOKEN) {
  console.error('Critical Error: BOT_TOKEN is missing in your .env file!');
  process.exit(1);
}

// 1. Initialize Telegraf Bot Instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// 2. Set Up the Stage Router with your Support Wizard
const stage = new Scenes.Stage([supportWizard]);

// 3. Register Global Middleware Components
bot.use(session());          // Remembers the user's conversational steps
bot.use(stage.middleware()); // Mounts the scene lifecycle system

// 4. Global Commands
bot.start((ctx) => ctx.scene.enter('support_wizard'));

// Fallback listener for users who message the bot outside an active scene context
bot.on('message', (ctx) => {
  ctx.reply("Please type /start to launch the Alif Bank Support system.\n\nIltimos, qo'llab-quvvatlash tizimini ishga tushirish uchun /start buyrug'ini bosing.");
});

module.exports = bot;
