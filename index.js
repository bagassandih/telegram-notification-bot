require('dotenv').config(); // Load environment variables
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const services = require('./services');

const app = express();
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken, { polling: true });

bot.onText(/\/start/, async (msg) => {
  try {
   await services.onStart(msg);
  } catch (error) {
    console.error(`An unexpected error occurred: ${error.message}`);
  }
});

app.post('/send', async (req, res) => {
  try {
    const message = req.body?.message;
    const typeMessage = req.body?.type;
    const text = `[${typeMessage}]: ${message}`;

    if (!typeMessage || !message) throw new Error('Need parameter message and type of message');

    const listUsers = await services.onSend();

    await Promise.all(listUsers.data.map(async chatId => {
      await bot.sendMessage(chatId.chat_id, text);
    }));

    const date = new Date();
    const formattedDate = date.toLocaleString('id-ID');
    console.log(`[${formattedDate}] Notif sent..`);

    res.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
