// Setup server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Import controllers
const { dukunCuacaController } = require('./controllers/dukunCuacaController');
const botController = require('./controllers/telegramBotController');

// Use middleware
app.use(cors());
app.use(express.json());

// Setup bot telegram
const TelegramBot = require('node-telegram-bot-api');
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken);

// Set webhook URL
const publicUrl = process.env.TELEGRAM_PUBLIC_URL; 
const webhookPath = `/webhook/${telegramBotToken}`;
const webhookUrl = `${publicUrl}${webhookPath}`;

// List endpoints
app.post(`/webhook/${telegramBotToken}`, (req, res) => {
  botController.webHookController(bot, req, res);
});
app.post('/send', (req, res) => {
  botController.sendMessageController(bot, req, res);
});

app.get('/dukun-cuaca', (req, res) => {
  dukunCuacaController(bot, req, res);
});

// Run servers
app.listen(port, () => {
    console.log(`🚀 Server's running on port ${port}`);

    // Set webhook URL for bot
    bot.setWebHook(webhookUrl)
      .then(() => console.log(`🚀 Webhook's set successfully ${webhookUrl}`))
      .catch((error) => console.error('Failed to set webhook:', error));
});