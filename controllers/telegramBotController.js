// Import files
const telegramBotServices = require('../services/telegramBotServices');
const userServices = require('../services/userServices');
const resources = require('../resources');

// Handler for webhook
async function webHookController(bot, req, res) {
  try {
    const { message, callback_query } = req.body;
    // Handle onstart events
    if (message?.text === '/start') await telegramBotServices.onStart(bot, message);
    // Handle locations events
    if (message?.location) await userServices.setLocation(bot, message);
    if (message?.text === '/set_location') await userServices.requestLocation(bot, message);
    if (callback_query?.data === 'set_location' && callback_query?.message) {
      await bot.answerCallbackQuery(callback_query.id, { text: 'Processing the request...' });
      await userServices.requestLocation(bot, callback_query.message);
    }; 

    res.sendStatus(resources.httpStatus.success);
  } catch (error) {
    console.error(error);
    res.sendStatus(resources.httpStatus.error);
  }
}

// Handler for send messages
async function sendMessageController(bot, req, res) {
  try {
    const message = req.body?.message;
    const typeMessage = req.body?.type;

    if (!typeMessage || !message) throw new Error('Need parameter message and type of message');

    const listUsers = await userServices.getAllUsers(typeMessage);
    if (!listUsers?.data) throw new Error('There are no users');

    await Promise.all(
      listUsers.data.map(async (chatId) => {
        try {
          const text = `[${typeMessage}]: ${message}`;
          await bot.sendMessage(chatId.chat_id, text);
        } catch (error) {
          console.error(`${chatId.username} cannot send: ${error.message}`);
        }
      })
    );

    res.status(resources.httpStatus.success).json(resources.successMessage);
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(resources.httpStatus.error).json({
      ...resources.errorMessage,
      error: error.message,
    });
  }
};

module.exports = {
  sendMessageController,
  webHookController
};
