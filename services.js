// Import files
const repositories = require('./repositories');
const resources = require('./resources.json');

// Service for /start commands
async function onStart(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const settings = resources.listFeatures;
  const location = resources.locationDefault;

  const { data, error: selectError } = await repositories.checkExistingDataUsers(chatId, username);
  if (selectError) throw new Error(`${selectError.message}`);
  if (data) throw new Error(`${username} already exists`);  

  await bot.sendMessage(chatId, `Welcome, ${username}!`);
  await repositories.insertDataUser(chatId, username, settings, location);

  console.log(`Data ${username} inserted successfully`);
}

// Service for /set_location commands
async function setLocation(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const location = { longitude: msg.location.longitude, latitude: msg.location.latitude };

  // Set text for message
  let text = `Your location has been successfully saved! 🎉\n\n`;
  text += `📍 *Your Location Details:*\n`;
  text += `- Latitude: ${location.latitude}\n- Longitude: ${location.longitude}\n\n`;
  text += `Thank you for sharing your location. We'll use it to provide you with accurate weather updates! 🌦️`;

  await bot.sendMessage(chatId, text, { parse_mode: 'Markdown'});
  await repositories.updateDataUser(chatId, username, location );

  console.log(`${username} successfully set up location`);
}

// Service for requesting location
async function requestLocation(bot, msg) {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "Let's set up your location to get accurate weather updates! 🌦️\n\nTap the button below to share your location:", {
    reply_markup: {
        keyboard: [
            [{ text: "📍 Share My Location" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
  });
}

// Service for getting data chatIds user based on type of message
async function getAllUsers(typeMessage) {
  return await repositories.getAllDataUsers(typeMessage);
}

module.exports = {
  onStart,
  getAllUsers,
  setLocation,
  requestLocation
};
