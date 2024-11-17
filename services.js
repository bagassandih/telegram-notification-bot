// Import files
const repositories = require('./repositories');
const resources = require('./resources.json');

// Service for /start commands
async function onStart(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const settings = resources.listFeatures;

  const { data, error: selectError } = await repositories.checkExistingDataUsers(chatId, username);
  if (selectError) throw new Error(`${selectError.message}`);
  if (data) throw new Error(`${username} already exists`);  
  
  await repositories.insertDataUser(chatId, username, settings);
  await bot.sendMessage(message.chat.id, `Welcome to San Asisstant BOT, ${message.from.username}!`);

  console.log(`Data ${username} inserted successfully`);
}

// Service for getting data chatIds user based on type of message
async function getAllUsers(typeMessage) {
  return await repositories.getAllDataUsers(typeMessage);
}

module.exports = {
  onStart,
  getAllUsers,
};
