// Import files
const services = require('./services');
const resources = require('./resources');

// Handler for webhook
async function webHookController(bot, req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.sendStatus(200);

    console.log(message);
    // Handle commands
    if (message.text === '/start') await services.onStart(bot, message);
    // Handle locations
    if (message.text === '/set_location') await services.requestLocation(bot, message);
    if (message.location) await services.setLocation(bot, message);

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
    const text = `[${typeMessage}]: ${message}`;

    if (!typeMessage || !message) throw new Error('Need parameter message and type of message');

    const listUsers = await services.getAllUsers(typeMessage);
    if (!listUsers?.data) throw new Error('There are no users');

    await Promise.all(
      listUsers.data.map(async (chatId) => {
        try {
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
}

module.exports = {
  sendMessageController,
  webHookController,
};
