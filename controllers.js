// Import files
import services from './services';
import { httpStatus, successMessage, errorMessage } from './resources';

// Bot setup
import TelegramBot from 'node-telegram-bot-api';
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken, { polling: true });

// Handler for /start commands
async function onStartController(msg) {
  try {
    await services.onStart(msg);
  } catch (error) {
    console.error(`Error on start: ${error.message}`);
  }
}

// Handler for send messages
async function sendMessageController (req, res) {
  try {
    const message = req.body?.message;
    const typeMessage = req.body?.type;
    const text = `[${typeMessage}]: ${message}`;

    if (!typeMessage || !message) throw new Error('Need parameter message and type of message');

    const listUsers = await services.getAllUsers(typeMessage);
    if (!listUsers?.data) throw new Error('There are no users');

    await Promise.all(
      listUsers.data.map(async (chatId) => {
        try {
          await bot.sendMessage(chatId.chat_id, text);
        } catch (error) {
          console.error(`${chatId.username} cannot send: ${error.message}`)
        }
      })
    );

    res.status(httpStatus.success).json(successMessage);
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(httpStatus.error).json({
      ...errorMessage,
      error: error.message,
    });
  }
};

export default {
  onStartController,
  sendMessageController,
};
