# Alif Bank Support Bot 🤖

A Telegram bot built with **Node.js + Telegraf + PostgreSQL (Knex)** that helps users report issues with bank terminals (ATMs).

The bot collects structured support data and sends it to an admin channel for fast processing.

---

## 🚀 Features

- 🌍 Multi-language support (Uzbek, Russian, English)
- 🏧 ATM/Terminal validation from database
- 📞 Phone number sharing via Telegram contact button
- 💳 Card number validation (Luhn algorithm)
- 💰 Amount input (cash inserted into ATM)
- 🕒 Incident date & time tracking
- 📝 Problem description collection
- 📡 Sends formatted reports to admin Telegram channel/bot
- 🗄️ Stores all reports in PostgreSQL

---

## 🧱 Tech Stack

- Node.js
- Telegraf (Telegram Bot Framework)
- PostgreSQL
- Knex.js (SQL query builder)
- dotenv

---

## 📦 Installation

```bash
git clone https://github.com/your-username/alif-bank-bot.git
cd alif-bank-bot
npm install
