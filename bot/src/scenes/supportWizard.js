const { Scenes, Markup } = require('telegraf');
const db = require('../db');
const strings = require('../languages');

// Luhn algorithm validation
function isValidCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '');

  // Must be exactly 16 digits
  if (!/^\d{16}$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

const supportWizard = new Scenes.WizardScene(
  'support_wizard',

  // Step 1: Language selection
  async (ctx) => {
    ctx.wizard.state.formData = {};

    await ctx.reply(
      "Xush kelibsiz! Bu Alif Bank qo'llab-quvvatlash boti. / Добро пожаловать! Это бот поддержки Алиф Банка. / Welcome to Alif Bank Support Bot.",
      Markup.inlineKeyboard([
        [Markup.button.callback("O'zbekcha 🇺🇿", 'lang_uz')],
        [Markup.button.callback('Русский 🇷🇺', 'lang_ru')],
        [Markup.button.callback('English 🇬🇧', 'lang_en')]
      ])
    );

    return ctx.wizard.next();
  },

  // Step 2: Language handler
  async (ctx) => {
    if (!ctx.callbackQuery) {
      return ctx.reply(
        'Please choose a language / Iltimos tilni tanlang / Пожалуйста, выберите язык.'
      );
    }

    const selection = ctx.callbackQuery.data;
    const langMap = {
      lang_uz: 'uz',
      lang_ru: 'ru',
      lang_en: 'en'
    };

    const selectedLang = langMap[selection];

    if (!selectedLang) {
      return ctx.reply('Invalid language selection.');
    }

    ctx.wizard.state.formData.language = selectedLang;

    await ctx.answerCbQuery();
    await ctx.reply(strings[selectedLang].ask_atm);

    return ctx.wizard.next();
  },

  // Step 3: ATM validation
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (!ctx.message || !ctx.message.text) {
      return ctx.reply(strings[lang].ask_atm);
    }

    const typedAtm = ctx.message.text.trim();

    try {
      const validAtm = await db('atms')
        .where({ atm_number: typedAtm })
        .first();

      if (!validAtm) {
        return ctx.reply(strings[lang].invalid_atm);
      }

      ctx.wizard.state.formData.atm_number = typedAtm;

      const contactLabels = {
        uz: '📞 Telefon raqamni yuborish',
        ru: '📞 Отправить номер телефона',
        en: '📞 Share Phone Number'
      };

      await ctx.reply(
        strings[lang].ask_phone,
        Markup.keyboard([
          [Markup.button.contactRequest(contactLabels[lang])]
        ])
          .resize()
          .oneTime()
      );

      return ctx.wizard.next();
    } catch (err) {
      console.error('ATM validation error:', err);
      return ctx.reply('Database error. Please try again.');
    }
  },

  // Step 4: Phone number
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (!ctx.message || !ctx.message.contact) {
      return ctx.reply(strings[lang].ask_phone);
    }

    ctx.wizard.state.formData.phone_number =
      ctx.message.contact.phone_number;

    await ctx.reply(
      strings[lang].ask_card,
      Markup.removeKeyboard()
    );

    return ctx.wizard.next();
  },

  // Step 5: Card validation
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (!ctx.message || !ctx.message.text) {
      return ctx.reply(strings[lang].ask_card);
    }

    const cardNumber = ctx.message.text.trim();

    if (!isValidCardNumber(cardNumber)) {
      return ctx.reply(strings[lang].invalid_card);
    }

    ctx.wizard.state.formData.card_number =
      cardNumber.replace(/\D/g, '');

    await ctx.reply(strings[lang].ask_problem);

    return ctx.wizard.next();
  },

  // Step 6: Problem description + save
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (!ctx.message || !ctx.message.text) {
      return ctx.reply(strings[lang].ask_problem);
    }

    ctx.wizard.state.formData.problem_description =
      ctx.message.text.trim();

    const data = ctx.wizard.state.formData;

    try {
      await db('problem_reports').insert({
        telegram_id: ctx.from.id,
        language: data.language,
        atm_number: data.atm_number,
        client_number: data.phone_number, // OK (you are storing phone here)
        card_number: data.card_number,
        problem_description: data.problem_description
      });

      const adminId = process.env.ADMIN_TELEGRAM_ID;

      if (adminId) {
        const adminMessage =
          `🚨 New ATM Problem Report!\n\n` +
          `👤 User: ${ctx.from.first_name || 'User'} (ID: ${ctx.from.id})\n` +
          `🌐 Language: ${data.language.toUpperCase()}\n` +
          `🏧 ATM Number: ${data.atm_number}\n` +
          `📞 Phone: +${data.phone_number}\n` +
          `💳 Card: ${data.card_number}\n` +
          `📝 Issue: ${data.problem_description}`;

        await ctx.telegram.sendMessage(adminId, adminMessage);
      }

      await ctx.reply(strings[lang].success);
    } catch (error) {
      console.error('Save report error:', error);
      await ctx.reply(
        'An error occurred. Please try again with /start.'
      );
    }

    return ctx.scene.leave();
  }
);

module.exports = supportWizard;