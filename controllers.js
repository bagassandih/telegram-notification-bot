const TelegramBot = require("node-telegram-bot-api");
const services = require("../services");

// Menginisialisasi bot dengan token
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken, { polling: true });

// Handler untuk perintah /start
async function onStartController(msg) {
  try {
    await services.onStart(msg);
  } catch (error) {
    console.error(`An unexpected error occurred: ${error.message}`);
  }
}

// Handler untuk mengirim pesan ke pengguna
async function sendMessageController (req, res) {
  try {
    const message = req.body?.message;
    const typeMessage = req.body?.type;
    const text = `[${typeMessage}]: ${message}`;

    if (!typeMessage || !message)
      throw new Error("Need parameter message and type of message");

    const listUsers = await services.onSend();

    await Promise.all(
      listUsers.data.map(async (chatId) => {
        await bot.sendMessage(chatId.chat_id, text);
      })
    );

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

module.exports = {
  onStartController,
  sendMessageController,
};
