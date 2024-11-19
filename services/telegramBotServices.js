const repositories = require('../repositories');
const resources = require('../resources.json');

// Start command for new user
async function onStart(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const settings = resources.listFeatures;
  const location = resources.locationDefault;

  let text = `Halo, ${username}!👋🏻 \n\n`;
  text += `Setup lokasi dulu, biar fitur-fiturnya bisa maksimal!🌤️ \n\n`;
  // text += `use /set_location to setup your location.`;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Setup Lokasi',
            callback_data: 'set_location',
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  };

  const { data } = await repositories.checkExistingDataUsers(chatId, username);
  if (data) return console.log(`${username} already exists`);

  await bot.sendMessage(chatId, text, options);
  await repositories.insertDataUser(chatId, username, settings, location);

  console.log(`Data ${username} inserted successfully`);
}

module.exports = {
  onStart,
};
