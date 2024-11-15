// Setup server
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; 
const cors = require('cors');

// Import controllers
const controllers = require('./controllers');

// Use middleware
app.use(cors());
app.use(express.json());

// Setup Bot
const TelegramBot = require('node-telegram-bot-api');
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken, { polling: true });

// list action and api routes
bot.onText(/\/start/, controllers.onStartController);
app.post('/send', controllers.sendMessageController);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
