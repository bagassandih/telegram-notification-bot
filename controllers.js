// import files
const services = require("./services");
const resources = require("./resources");

// Menginisialisasi bot dengan token
const TelegramBot = require("node-telegram-bot-api");
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken, { polling: true });

// Handler untuk perintah /start
async function onStartController(msg) {
  try {
    await services.onStart(msg);
  } catch (error) {
    console.error(`Error on start: ${error.message}`);
  }
}

// Handler untuk mengirim pesan ke pengguna
async function sendMessageController (req, res) {
  try {
    const message = req.body?.message;
    const typeMessage = req.body?.type;
    const text = `[${typeMessage}]: ${message}`;

    if (!typeMessage || !message) throw new Error("Need parameter message and type of message");

    const listUsers = await services.getUsers();
    if (!listUsers?.data) throw new Error('There are no users');

    await Promise.all(
      listUsers.data.map(async (chatId) => {
        try {
          await bot.sendMessage(chatId.chat_id, text);
          return true;
        } catch (error) {
          console.error(`${chatId.username} cannot send: ${error.message}`)
          return false;
        }
      })
    );

    res.status(resources.httpStatus.success).json(resources.successMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(resources.httpStatus.error).json({
      ...resources.errorMessage,
      error: error.message,
    });
  }
};

module.exports = {
  onStartController,
  sendMessageController,
};
