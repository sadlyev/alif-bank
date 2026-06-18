const { Scenes, Markup } = require('telegraf');
const db = require('../db');
const strings = require('../languages');

const supportWizard = new Scenes.WizardScene(
  'support_wizard',

  // Step 1: Welcome & Ask for Language Selection Buttons
  async (ctx) => {
    ctx.wizard.state.formData = {}; // Initialize data store object
    
    await ctx.reply(
      "Xush kelibsiz! Bu Alif Bank qo'llab-quvvatlash boti. / Добро пожаловать! Это бот поддержки Алиф Банка. / Welcome to Alif Bank Support Bot.",
      Markup.inlineKeyboard([
        [Markup.button.callback("O'zbekcha 🇺🇿", 'lang_uz')],
        [Markup.button.callback('Русский 🇷🇺', 'lang_ru')],
        [Markup.button.callback('English 🇬🇧', 'lang_en')]
      ])
    );
    return ctx.next();
  },

  // Step 2: Catch Selected Language Button & Prompt for ATM number entry
  async (ctx) => {
    if (!ctx.callbackQuery) {
      return ctx.reply('Please choose a language / Iltimos tilni tanlang / Пожалуйста, выберите язык.');
    }

    const selection = ctx.callbackQuery.data;
    const langMap = { lang_uz: 'uz', lang_ru: 'ru', lang_en: 'en' };
    const selectedLang = langMap[selection];

    ctx.wizard.state.formData.language = selectedLang;
    await ctx.answerCbQuery();

    await ctx.reply(strings[selectedLang].ask_atm);
    return ctx.next();
  },

  // Step 3: Validate ATM entry input against DB list & Prompt for Client ID number
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;
    if (!ctx.message || !ctx.message.text) {
      return ctx.reply(strings[lang].ask_atm);
    }

    const typedAtm = ctx.message.text.trim();

    // Check PostgreSQL using Knex if the user typed a real ATM entry from your seed data list
    const validAtm = await db('atms').where({ atm_number: typedAtm }).first();
    if (!validAtm) {
      return ctx.reply(strings[lang].invalid_atm);
    }

    ctx.wizard.state.formData.atm_number = typedAtm;
    await ctx.reply(strings[lang].ask_client);
    return ctx.next();
  },

  // Step 4: Capture Client ID Number & Prompt for Problem text details
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;
    if (!ctx.message || !ctx.message.text) {
      return ctx.reply(strings[lang].ask_client);
    }

    ctx.wizard.state.formData.client_number = ctx.message.text.trim();
    await ctx.reply(strings[lang].ask_problem);
    return ctx.next();
  },

  // Step 5: Capture Problem info text, Save log dataset to DB, Alert Admin, Send success status
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;
    if (!ctx.message || !ctx.message.text) {
      return ctx.reply(strings[lang].ask_problem);
    }

    ctx.wizard.state.formData.problem_description = ctx.message.text.trim();
    const data = ctx.wizard.state.formData;

    try {
      // 1. Direct insertion to PostgreSQL using Knex
      await db('problem_reports').insert({
        telegram_id: ctx.from.id,
        language: data.language,
        atm_number: data.atm_number,
        client_number: data.client_number,
        problem_description: data.problem_description
      });

      // 2. Instantly forward the report to the Admin if configuration exists
      const adminId = process.env.ADMIN_TELEGRAM_ID;
      if (adminId) {
        const adminMessage = `🚨 **New ATM Problem Report!**\n\n` +
                             `👤 **User:** [${ctx.from.first_name || 'User'}](tg://user?id=${ctx.from.id}) (ID: ${ctx.from.id})\n` +
                             `🌐 **Language:** ${data.language.toUpperCase()}\n` +
                             `🏧 **ATM Number:** ${data.atm_number}\n` +
                             `💳 **Client ID:** ${data.client_number}\n` +
                             `📝 **Issue:** ${data.problem_description}`;
        
        await ctx.telegram.sendMessage(adminId, adminMessage, { parse_mode: 'Markdown' });
      }

      // 3. Send success validation message back to client user
      await ctx.reply(strings[lang].success);
    } catch (error) {
      console.error('Database insertion or admin alert breakdown error:', error);
      await ctx.reply('An error occurred. Please try again with /start.');
    }

    return ctx.scene.leave(); // Destroys context wizard state session clean
  }
);

module.exports = supportWizard;
