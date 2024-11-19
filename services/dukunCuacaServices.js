const utilities = require('../utilities');

// Fetch data weather from external services
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

// Generate text for chat
function generateTextDukunCuaca(resultMap, userLocation, dateNow) {
  let text = `🌤️ *[Dukun Cuaca]*\n\n`;
  text += `Hari ini tanggal *${dateNow}* \n`;
  text += `${userLocation.county}, ${userLocation.city}, ${userLocation.state}:\n`;

  resultMap.list.forEach((day) => {
    text += `- Jam *${day.time} ${userLocation.timeZoneStd}* kayanya *${day.weather_description}*, suhunya *${day.temp}°*. \n`;
  });

  const suggestion = utilities.getSuggestion(resultMap.list);
  text += `\n🌟${suggestion}`;

  return text;
}

module.exports = {
  fetchWeather,
  generateTextDukunCuaca,
};
