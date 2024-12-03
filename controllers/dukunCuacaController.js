const dukunCuacaServices = require('../services/dukunCuacaServices');
const userServices = require('../services/userServices');
const utilities = require('../utilities');
const resources = require('../resources.json');

async function dukunCuacaController(bot, req, res) {
  try {
    const listUsers = await userServices.getAllUsers('Dukun Cuaca');
    if (!listUsers?.data?.length) throw new Error('There are no users');

    await Promise.all(
      listUsers.data.map(async (user) => {
        try {
          const result = await dukunCuacaServices.fetchWeather(user);

          const userLocation = user.location;
          const dateNowStamps = Math.floor(new Date().getTime() / 1000);
          const dateNow = utilities.formatTimestampToTime(dateNowStamps, userLocation).date;

          const resultMap = {
            location: result.city.name,
            list: result.list
              .filter((entry) => utilities.formatTimestampToTime(entry.dt, userLocation).date.startsWith(dateNow))
              .map(({ dt, dt_txt, weather, main }) => {
                const { time, date } = utilities.formatTimestampToTime(dt, userLocation);
                return {
                  time,
                  date,
                  original_time: dt_txt,
                  weather_main: weather[0].main,
                  weather_description: weather[0].description,
                  temp: Math.floor(parseFloat(main.temp) - 273.15),
                };
              }),
          };

          const text = dukunCuacaServices.generateTextDukunCuaca(resultMap, userLocation, dateNow);
          try {
            await bot.sendMessage(user.chat_id, text, { parse_mode: 'Markdown' });
          } catch (error) {
            console.error(`Error sending message to ${user.username}: ${error.message}`);
          }
        } catch (error) {
          console.error(`${user.username} cannot send: ${error.message}`);
        }
      })
    );
    res
      .status(resources.httpStatus.success)
      .json({ ...resources.successMessage });
  } catch (error) {
    res
      .status(resources.httpStatus.error)
      .json({ ...resources.errorFetch, error: error.message });
  }
}

module.exports = {
  dukunCuacaController,
};
