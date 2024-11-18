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

// Setup bot telegram
const TelegramBot = require('node-telegram-bot-api');
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken);

// Set webhook URL
const publicUrl = process.env.TELEGRAM_PUBLIC_URL_LOCAL; 
const webhookPath = `/webhook/${telegramBotToken}`;
const webhookUrl = `${publicUrl}${webhookPath}`;

// List endpoints
app.post(`/webhook/${telegramBotToken}`, (req, res) => {
  controllers.webHookController(bot, req, res);
});
app.post('/send', (req, res) => {
  controllers.sendMessageController(bot, req, res)
});

bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data; // Mengambil data dari tombol yang diklik

  console.log('Callback Query Data:', data);  // Debugging untuk memastikan callback data masuk

  if (data === 'share_location') {
      // Jika tombol "Share My Location" dipilih
      await bot.sendMessage(chatId, "Please share your location by clicking below:", {
          reply_markup: {
              keyboard: [
                  [{ text: "📍 Share My Location", request_location: true }]
              ],
              resize_keyboard: true,
              one_time_keyboard: true
          }
      });
  } else if (data === 'weather') {
      // Jika tombol "Request Weather" dipilih
      await bot.sendMessage(chatId, "You chose to get weather information!");
  }
});


// Run servers
app.listen(port, () => {
    console.log(`🚀 Server's running on port ${port}`);

    // Set webhook URL for bot
    bot.setWebHook(webhookUrl)
      .then(() => console.log(`🚀 Webhook's set successfully ${webhookUrl}`))
      .catch((error) => console.error('Failed to set webhook:', error));
});