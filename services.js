// Import files
const repositories = require('./repositories');
const resources = require('./resources.json');

// Service for /start commands
async function onStart(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const settings = resources.listFeatures;
  const location = resources.locationDefault;
  
  let text = `Welcome, ${username}!👋🏻 \n\n`;
  text += `Let's set up your location to activate features of Dukun Cuaca!🌤️ \n\n`;
  // text += `use /set_location to setup your location.`;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Setup Location',
            callback_data: 'set_location',
          }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };

  const { data } = await repositories.checkExistingDataUsers(chatId, username);
  if (data) return console.log(`${username} already exists`);  

  await bot.sendMessage(chatId, text, options);
  await repositories.insertDataUser(chatId, username, settings, location);

  console.log(`Data ${username} inserted successfully`);
}

// Service for /set_location commands
async function setLocation(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  const location = { longitude: msg.location.longitude, latitude: msg.location.latitude };

  // Set text for message
  let text = `📍 *Your Location Details:*\n`;
  text += `- Latitude: ${location.latitude}\n- Longitude: ${location.longitude}\n\n`;
  text += `Nice ${username}, we'll use it to provide you with our features!`;

  await bot.sendMessage(chatId, text, { parse_mode: 'Markdown'});
  await repositories.updateDataUser(chatId, username, location );

  console.log(`${username} successfully set up location`);
}

// Service for requesting location
async function requestLocation(bot, msg) {
  const chatId = msg.chat.id;

  const buttonText = `📍 Share My Location`;
  const text = `Tap the button "${buttonText}" below to continue`;

  await bot.sendMessage(chatId, text, {
      reply_markup: {
          keyboard: [
              [
                {
                  text: buttonText,
                  request_location: true,
                }
              ]
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
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
