// Import files
const repositories = require('./repositories');
const resources = require('./resources.json');
const utilities = require('./utilities');

// Service for /start commands
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

// Service for getting data geolocation
async function getGeoLocation(latitude, longitude) {
  const baseUrl = process.env.GEOAPIFY_URL;
  const apiKey = process.env.GEOAPIFY_API_KEY;
  const apiUrl = `${baseUrl}?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
  const respons = await fetch(apiUrl);
  return await respons.json();
}

// Service for /set_location commands
async function setLocation(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;
  
  // Get location from message
  const parameterLocation = { longitude: msg.location.longitude, latitude: msg.location.latitude };
  const getLocation = await getGeoLocation(parameterLocation.latitude, parameterLocation.longitude);

  const location = {
    longitude: getLocation.features[0].properties.lon,
    latitude: getLocation.features[0].properties.lat,
    county: getLocation.features[0].properties.county,
    state: getLocation.features[0].properties.state,
    city: getLocation.features[0].properties.city,
    timeZone: getLocation.features[0].properties.timezone.name,
    timeZoneStd: getLocation.features[0].properties.timezone.abbreviation_STD
  };

  // Set text for message
  let text = `📍 *Detail Lokasi:*\n`;
  text += `- Latitude: ${location.latitude}\n- Longitude: ${location.longitude}\n\n`;
  text += `Nais ${username}, kita bakalan pake infonya buat nyediain fitur-fitur kita!`;

  await bot.sendMessage(chatId, text, { parse_mode: 'Markdown'});
  await repositories.updateDataUser(chatId, username, { location: location } );

  console.log(`${username} successfully set up location`);
}

async function fetchWeather(user) {
  const baseUrl = process.env.DUKUN_CUACA_API_URL;
  const apiKey = process.env.DUKUN_CUACA_API_KEY;
  const lat = user.location.latitude;
  const lon = user.location.longitude;
  const cnt = 10;
  const lang = 'id';
  
  const weatherUrl = `${baseUrl}/?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=${lang}&cnt=${cnt}`;
  const response = await fetch(weatherUrl);
  return await response.json();
}

// Service for requesting location
async function requestLocation(bot, msg) {
  const chatId = msg.chat.id;

  const buttonText = `📍 Kasih tau lokasi`;
  const text = `Lanjut tap tombol "${buttonText}" dibawah`;

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

// Service for generate text for chat
function generateTextDukunCuaca(resultMap, userLocation, dateNow) {
  let text = `🌤️ *[Dukun Cuaca]*\n\n`;
  text += `Hari ini tanggal *${dateNow}* \n` ;
  text += `${userLocation.county}, ${userLocation.city}, ${userLocation.state}:\n`;
  
  resultMap.list.forEach(day => {
    text += `- Jam *${day.time} ${userLocation.timeZoneStd}* kayanya *${day.weather_description}*, suhunya *${day.temp}°*. \n`
  });

  const suggestion = utilities.getSuggestion(resultMap.list);
  text += `\n🌟${suggestion}`;

  return text;
}

module.exports = {
  onStart,
  getAllUsers,
  setLocation,
  requestLocation,
  fetchWeather,
  generateTextDukunCuaca
};
