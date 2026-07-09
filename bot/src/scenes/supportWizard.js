
const { Scenes, Markup } = require('telegraf');
const db = require('../db');
const strings = require('../languages');

function getText(ctx) {
  if (!ctx.message || !ctx.message.text) {
    return null;
  }
  return ctx.message.text.trim();
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function getString(lang, key, fallback) {
  if (strings[lang] && strings[lang][key]) {
    return strings[lang][key];
  }
  return fallback;
}

function isCancelCommand(ctx) {
  const text = getText(ctx);
  return text && text.toLowerCase() === '/cancel';
}

function isStartCommand(ctx) {
  const text = getText(ctx);
  return text && text.toLowerCase() === '/start';
}

async function askPhone(ctx, lang) {
  const contactLabels = {
    uz: '📞 Telefon raqamni yuborish',
    ru: '📞 Отправить номер телефона',
    en: '📞 Share Phone Number'
  };

  return ctx.reply(
    strings[lang].ask_phone,
    Markup.keyboard([[Markup.button.contactRequest(contactLabels[lang])]])
      .resize()
      .oneTime()
  );
}

const supportWizard = new Scenes.WizardScene(
  'support_wizard',

  // Step 1: Language selection
  async (ctx) => {
    ctx.wizard.state.formData = {};

    await ctx.reply(
      "Xush kelibsiz! Bu terminal qo'llab-quvvatlash boti. / Добро пожаловать! Это бот поддержки терминала. / Welcome to the terminal support bot.",
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
    if (isStartCommand(ctx)) {
      await ctx.reply('Restarting...', Markup.removeKeyboard());
      return ctx.scene.reenter();
    }

    if (!ctx.callbackQuery) {
      return ctx.reply(
        'Please choose a language / Iltimos tilni tanlang / Пожалуйста, выберите язык.'
      );
    }

    const langMap = { lang_uz: 'uz', lang_ru: 'ru', lang_en: 'en' };
    const selectedLang = langMap[ctx.callbackQuery.data];

    if (!selectedLang) {
      await ctx.answerCbQuery();
      return ctx.reply('Invalid language selection.');
    }

    ctx.wizard.state.formData.language = selectedLang;

    await ctx.answerCbQuery();
    await ctx.reply(strings[selectedLang].ask_atm);

    return ctx.wizard.next();
  },

  // Step 3: Terminal ID validation
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (isStartCommand(ctx)) {
      await ctx.reply('Restarting...', Markup.removeKeyboard());
      return ctx.scene.reenter();
    }

    if (isCancelCommand(ctx)) {
      await ctx.reply('Cancelled.', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const typedAtm = getText(ctx);

    if (!typedAtm) {
      return ctx.reply(strings[lang].ask_atm);
    }

    try {
      const validAtm = await db('atms').where({ atm_number: typedAtm }).first();

      if (!validAtm) {
        return ctx.reply(strings[lang].invalid_atm);
      }

      ctx.wizard.state.formData.atm_number = typedAtm;
      ctx.wizard.state.formData.atm_name = validAtm.name;

      await ctx.reply(
        strings[lang].ask_problem,
        Markup.inlineKeyboard([
          [Markup.button.callback(strings[lang].problem_no_receipt, 'problem_no_receipt')],
          [Markup.button.callback(strings[lang].problem_no_money, 'problem_no_money')],
          [Markup.button.callback(strings[lang].problem_other, 'problem_other')]
        ])
      );

      return ctx.wizard.next();
    } catch (err) {
      console.error('Terminal validation error:', err);
      return ctx.reply('Database error. Please try again.');
    }
  },

  // Step 4: Problem selection
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (isStartCommand(ctx)) {
      await ctx.reply('Restarting...', Markup.removeKeyboard());
      return ctx.scene.reenter();
    }

    if (isCancelCommand(ctx)) {
      await ctx.reply('Cancelled.', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    if (!ctx.callbackQuery) {
      return ctx.reply(
        strings[lang].ask_problem,
        Markup.inlineKeyboard([
          [Markup.button.callback(strings[lang].problem_no_receipt, 'problem_no_receipt')],
          [Markup.button.callback(strings[lang].problem_no_money, 'problem_no_money')],
          [Markup.button.callback(strings[lang].problem_other, 'problem_other')]
        ])
      );
    }

    await ctx.answerCbQuery();

    const problem = ctx.callbackQuery.data;

    if (problem === 'problem_no_receipt') {
      ctx.wizard.state.formData.problem_description = strings[lang].problem_no_receipt;
      ctx.wizard.state.formData.skip_card_info = true;

      await ctx.reply(strings[lang].ask_amount);
      return ctx.wizard.selectStep(5);
    }

    if (problem === 'problem_no_money') {
      ctx.wizard.state.formData.problem_description = strings[lang].problem_no_money;
      ctx.wizard.state.formData.skip_card_info = false;

      await ctx.reply(strings[lang].ask_amount);
      return ctx.wizard.selectStep(5);
    }

    if (problem === 'problem_other') {
      ctx.wizard.state.formData.skip_card_info = false;

      await ctx.reply(strings[lang].ask_problem_other);
      return ctx.wizard.next();
    }

    return ctx.reply(strings[lang].ask_problem);
  },

  // Step 5: Custom problem description
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (isStartCommand(ctx)) {
      await ctx.reply('Restarting...', Markup.removeKeyboard());
      return ctx.scene.reenter();
    }

    if (isCancelCommand(ctx)) {
      await ctx.reply('Cancelled.', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const problem = getText(ctx);

    if (!problem) {
      return ctx.reply(strings[lang].ask_problem_other);
    }

    ctx.wizard.state.formData.problem_description = problem;

    await ctx.reply(strings[lang].ask_amount);

    return ctx.wizard.next();
  },

  // Step 6: Amount entered to terminal
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (isStartCommand(ctx)) {
      await ctx.reply('Restarting...', Markup.removeKeyboard());
      return ctx.scene.reenter();
    }

    if (isCancelCommand(ctx)) {
      await ctx.reply('Cancelled.', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const amountRaw = getText(ctx);

    if (!amountRaw) {
      return ctx.reply(strings[lang].ask_amount);
    }

    const amount = onlyDigits(amountRaw);

    if (!amount || !/^\d+$/.test(amount)) {
      return ctx.reply(strings[lang].invalid_amount);
    }

    ctx.wizard.state.formData.amount = amount;

    if (ctx.wizard.state.formData.skip_card_info) {
      ctx.wizard.state.formData.card_first4 = null;
      ctx.wizard.state.formData.card_last4 = null;
      ctx.wizard.state.formData.card_number = null;

      await askPhone(ctx, lang);
      return ctx.wizard.selectStep(8);
    }

    await ctx.reply(strings[lang].ask_card);
    return ctx.wizard.next();
  },

  // Step 7: First 4 digits of card
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (isStartCommand(ctx)) {
      await ctx.reply('Restarting...', Markup.removeKeyboard());
      return ctx.scene.reenter();
    }

    if (isCancelCommand(ctx)) {
      await ctx.reply('Cancelled.', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const digits = onlyDigits(getText(ctx));

    if (!/^\d{4}$/.test(digits)) {
      return ctx.reply(strings[lang].invalid_card_first4);
    }

    ctx.wizard.state.formData.card_first4 = digits;

    await ctx.reply(strings[lang].ask_card_last4);
    return ctx.wizard.next();
  },

  // Step 8: Last 4 digits of card
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (isStartCommand(ctx)) {
      await ctx.reply('Restarting...', Markup.removeKeyboard());
      return ctx.scene.reenter();
    }

    if (isCancelCommand(ctx)) {
      await ctx.reply('Cancelled.', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    const digits = onlyDigits(getText(ctx));

    if (!/^\d{4}$/.test(digits)) {
      return ctx.reply(strings[lang].invalid_card_last4);
    }

    ctx.wizard.state.formData.card_last4 = digits;
    ctx.wizard.state.formData.card_number = `${ctx.wizard.state.formData.card_first4}********${digits}`;

    await askPhone(ctx, lang);
    return ctx.wizard.next();
  },

  // Step 9: Phone number + save + notify channel
  async (ctx) => {
    const lang = ctx.wizard.state.formData.language;

    if (isStartCommand(ctx)) {
      await ctx.reply('Restarting...', Markup.removeKeyboard());
      return ctx.scene.reenter();
    }

    if (isCancelCommand(ctx)) {
      await ctx.reply('Cancelled.', Markup.removeKeyboard());
      return ctx.scene.leave();
    }

    let phoneNumber = null;

    if (ctx.message?.contact?.phone_number) {
      phoneNumber = ctx.message.contact.phone_number;
    } else if (ctx.message?.text) {
      phoneNumber = ctx.message.text.trim();
    }

    if (!phoneNumber) {
      return ctx.reply(strings[lang].ask_phone);
    }

    phoneNumber = phoneNumber.replace(/\s/g, '');

    if (!/^\+?\d{7,15}$/.test(phoneNumber)) {
      return ctx.reply(
        getString(
          lang,
          'invalid_phone',
          lang === 'ru'
            ? 'Введите корректный номер телефона или отправьте контакт.'
            : lang === 'uz'
              ? "To'g'ri telefon raqamini kiriting yoki kontaktni yuboring."
              : 'Please enter a valid phone number or share your contact.'
        )
      );
    }

    ctx.wizard.state.formData.phone_number = phoneNumber;

    const data = ctx.wizard.state.formData;
    const submittedAt = new Date();

    try {
      await db('problem_reports').insert({
        telegram_id: ctx.from.id,
        language: data.language,
        atm_number: data.atm_number,
        client_number: data.phone_number,
        card_number: data.card_number || null,
        amount: data.amount,
        problem_description: data.problem_description,
        created_at: submittedAt
      });

      const channelId = process.env.CHANNEL_TELEGRAM_ID;

      if (channelId) {
        const formattedPhone = `+${data.phone_number.replace(/^\+/, '')}`;
        const submittedTime = submittedAt.toLocaleString('ru-RU', {
          timeZone: 'Asia/Tashkent',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        const channelMessage =
          `🚨 Новое обращение по терминалу!\n\n` +
          `👤 Пользователь: ${ctx.from.first_name || 'Пользователь'} (ID: ${ctx.from.id})\n` +
          `🌐 Язык: ${data.language.toUpperCase()}\n` +
          `📟 Номер терминала: ${data.atm_number}\n` +
          `🏢 Название терминала: ${data.atm_name || '-'}\n` +
          `📝 Проблема: ${data.problem_description}\n` +
          `💰 Сумма, внесённая в терминал: ${data.amount} UZS\n` +
          `💳 Карта: ${data.card_number || 'Не указана'}\n` +
          `📞 Телефон: ${formattedPhone}\n` +
          `🕒 Время отправки: ${submittedTime}`;

        await ctx.telegram.sendMessage(channelId, channelMessage);
      }

      await ctx.reply(strings[lang].success, Markup.removeKeyboard());
    } catch (error) {
      console.error('Save report error:', error);
      await ctx.reply(
        'An error occurred. Please try again with /start.',
        Markup.removeKeyboard()
      );
    }

    return ctx.scene.leave();
  }
);

module.exports = supportWizard;
