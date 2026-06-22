const { Telegraf, Scenes, session } = require('telegraf'); // Native session integration
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
bot.use(session());          // Fixed: Uses clean, native memory sessions
bot.use(stage.middleware()); // Mounts the scene lifecycle system

// 4. Global Commands
bot.start((ctx) => ctx.scene.enter('support_wizard'));

// Fallback listener
bot.on('message', (ctx) => {
  ctx.reply(
  "Please type /start to launch the Alif Bank Support system.\n\n" +
  "Iltimos, qo'llab-quvvatlash tizimini ishga tushirish uchun /start buyrug'ini bosing.\n\n" +
  "Пожалуйста, введите /start, чтобы запустить систему поддержки Alif Bank."
);
});

module.exports = bot;
