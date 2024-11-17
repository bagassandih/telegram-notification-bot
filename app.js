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
const bot = new TelegramBot(telegramBotToken, { webHook: true });

// Set webhook URL
const publicUrl = process.env.PUBLIC_URL; //
const webhookPath = `/webhook/${telegramBotToken}`;
const webhookUrl = `${publicUrl}${webhookPath}`;

bot.setWebHook(webhookUrl).then(() => {
    console.log(`Webhook set to: ${webhookUrl}`);
});

// List action and API routes
app.post(webhookPath, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// List action and api routes
bot.onText(/\/start/, controllers.onStartController);
app.post('/send', controllers.sendMessageController);

// Run the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
