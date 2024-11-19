const repositories = require('../repositories');

// Get data geolocation from external services
async function getGeoLocation(latitude, longitude) {
  const baseUrl = process.env.GEOAPIFY_URL;
  const apiKey = process.env.GEOAPIFY_API_KEY;
  const apiUrl = `${baseUrl}?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
  const respons = await fetch(apiUrl);
  return await respons.json();
}

// Handle location request
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
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}

// Handle location after request
async function setLocation(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  // Get location from message
  const parameterLocation = {
    longitude: msg.location.longitude,
    latitude: msg.location.latitude,
  };

  const getLocation = await getGeoLocation(
    parameterLocation.latitude,
    parameterLocation.longitude
  );
  const location = {
    longitude: getLocation.features[0].properties.lon,
    latitude: getLocation.features[0].properties.lat,
    county: getLocation.features[0].properties.county,
    state: getLocation.features[0].properties.state,
    city: getLocation.features[0].properties.city,
    timeZone: getLocation.features[0].properties.timezone.name,
    timeZoneStd: getLocation.features[0].properties.timezone.abbreviation_STD,
  };

  // Set text for message
  let text = `📍 *Detail Lokasi:*\n`;
  text += `- Latitude: ${location.latitude}\n- Longitude: ${location.longitude}\n\n`;
  text += `Nais ${username}, kita bakalan pake infonya buat nyediain fitur-fitur kita!`;

  await bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup: {
      remove_keyboard: true,
    },
  });
  await repositories.updateDataUser(chatId, username, { location: location });

  console.log(`${username} successfully set up location`);
}

// Getting data chatIds user based on type of message
async function getAllUsers(typeMessage) {
  return await repositories.getAllDataUsers(typeMessage);
}

module.exports = {
  getAllUsers,
  setLocation,
  requestLocation,
};


