// Import files
const services = require('./services');
const resources = require('./resources');

// Handler for /start commands
async function onStartController(bot, msg) {
  try {
    await bot.sendMessage(msg.chat.id, `Welcome to testing mode, ${msg.from.username}!`);
    await services.onStart(msg);
  } catch (error) {
    console.error(`Error on start: ${error.message}`);
  }
}

// Handler for send messages
async function sendMessageController (bot, req, res) {
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
  onStartController,
  sendMessageController,
};
