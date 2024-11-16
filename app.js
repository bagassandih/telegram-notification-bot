// Setup server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000; 

// Import controllers
const controllers = require('./controllers');

// Use middleware
app.use(cors());
app.use(express.json());

// Setup Bot
const TelegramBot = require('node-telegram-bot-api');
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken, { polling: true });

// List action and api routes
bot.onText(/\/start/, controllers.onStartController);
app.post('/send', controllers.sendMessageController);

// Run the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
