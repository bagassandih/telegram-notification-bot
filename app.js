// Setup server
require('dotenv').config();
import express, { json } from 'express';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3000; 

// Import controllers
import controllers from './controllers';

// Use middleware
app.use(cors());
app.use(json());

// Setup Bot
import TelegramBot from 'node-telegram-bot-api';
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken, { polling: true });

// List action and api routes
bot.onText(/\/start/, controllers.onStartController);
app.post('/send', controllers.sendMessageController);

// Run the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
