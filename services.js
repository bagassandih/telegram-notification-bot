const repositories = require('./repositories');

async function onStart(msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  const { data, error: selectError } = await repositories.checkExistingDataUsers(chatId, username);
  if (selectError) throw new Error(`Error while checking data: ${selectError.message}`);
  if (data) throw new Error(`${username} already exists`);
  
  await repositories.insertDataUser(chatId, username);

  console.log(`Data ${username} inserted successfully`);
}

async function getUsers() {
  return await repositories.getDataUsers();
}

module.exports = {
  onStart,
  getUsers,
};
