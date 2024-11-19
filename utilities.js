// Format unix timestamp to timestamp
function formatTimestampToTime(unixTimestamp, userLocation) {
  // Convert Unix timestamp to milliseconds
  const timeZone = userLocation.timeZone;
  const timeZoneStd = userLocation.timeZoneStd;
  const date = new Date(unixTimestamp * 1000);

  // Format for time
  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timeZone,
    hour12: false,
  };

  // Format for date
  const optionsDate = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return {
    time: `${date.toLocaleString('id-ID', optionsTime)} ${timeZoneStd}`,
    date: `${date.toLocaleString('id-ID', optionsDate)}`,
  };
}

// To get sugggestion based on list of weather conditions
function getSuggestion(list) {
  // Define weather priority
  const weatherPriority = [
    'Tornado', // Highest priority
    'Thunderstorm', // Very dangerous
    'Ash', // Potentially harmful
    'Snow', // Extreme cold
    'Rain', // Moderate danger
    'Drizzle', // Light rain
    'Clouds', // Normal but cloudy
    'Clear', // Safe weather
    'Fog', // Reduced visibility
  ];

  // Count the occurrences of each weather
  const weatherCount = list.reduce((count, entry) => {
    count[entry.weather_main] = (count[entry.weather_main] || 0) + 1;
    return count;
  }, {});

  // Check if any weather matches priority
  const priorityWeather = weatherPriority.find(
    (weather) => weatherCount[weather]
  );

  // Determine dominant weather
  const dominantWeather =
    priorityWeather ||
    Object.entries(weatherCount).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  // Suggestions setup
  let suggestion = '';
  switch (dominantWeather) {
    case 'Rain':
      suggestion = 'Bawa *payung* atau *mantel* sabi sih sama sendal! 👍🏻';
      break;
    case 'Clouds':
      suggestion =
        'Cuaca bisa aja mendung, tetep sedia *payung* atau *mantel* buat jaga-jaga. 🫰🏻';
      break;
    case 'Clear':
      suggestion = 'Langit cerah nih, cocok banget buat nongki! 🤙🏻';
      break;
    case 'Snow':
      suggestion = 'Bawa jaket tebel, cuacanya bersalju!';
      break;
    case 'Thunderstorm':
      suggestion =
        'Cuaca buruk banget nih, petir di mana-mana. Mending rebahan aja!';
      break;
    case 'Drizzle':
      suggestion =
        'Meskipun cuma gerimis, ujan tetaplah ujan. Bawa persediaan udah sip banget! 💪🏻';
      break;
    case 'Tornado':
      suggestion = 'Jangan coba-coba keluar, biar gak kebawa tornado! 🫵🏻';
      break;
    case 'Ash':
      suggestion =
        'Sayangin pernapasan kamu, pake masker udah cukup sementara. 👋🏻';
      break;
    case 'Fog':
      suggestion = 'Berkabut sih, tetep hati-hati. ✌🏻';
      break;
    default:
      suggestion = 'Tetap siap-siap ya, cuaca bisa berubah kapan saja. 🫰🏻';
      break;
  }

  return suggestion;
}

module.exports = {
  formatTimestampToTime,
  getSuggestion,
};
