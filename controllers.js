// Import files
const services = require('./services');
const resources = require('./resources');
const { formatTimestampToTime, getSuggestion } = require('./utilities');

// Handler for webhook
async function webHookController(bot, req, res) {
  try {
    const { message, callback_query } = req.body;

    // Handle onstart events
    if (message?.text === '/start') await services.onStart(bot, message);

    // Handle locations events
    if (message?.text === '/set_location') await services.requestLocation(bot, message);
    if (message?.location) await services.setLocation(bot, message);
    if (callback_query?.data === 'set_location' && callback_query?.message) {
      await bot.answerCallbackQuery(callback_query.id, { text: 'Processing the request...' });
      await services.requestLocation(bot, callback_query.message);
    }; 

    res.sendStatus(resources.httpStatus.success);
  } catch (error) {
    console.error(error);
    res.sendStatus(resources.httpStatus.error);
  }
}

// Handler for send messages
async function sendMessageController(bot, req, res) {
  try {
    const message = req.body?.message;
    const typeMessage = req.body?.type;

    if (!typeMessage || !message) throw new Error('Need parameter message and type of message');

    const listUsers = await services.getAllUsers(typeMessage);
    if (!listUsers?.data) throw new Error('There are no users');

    await Promise.all(
      listUsers.data.map(async (chatId) => {
        try {
          const text = `[${typeMessage}]: ${message}`;
          await bot.sendMessage(chatId.chat_id, text);
        } catch (error) {
          console.error(`${chatId.username} cannot send: ${error.message}`);
        }
      })
    );

    res.status(resources.httpStatus.success).json(resources.successMessage);
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(resources.httpStatus.error).json({
      ...resources.errorMessage,
      error: error.message,
    });
  }
};

async function dukunCuacaController(bot, req, res) {
  try {
    const listUsers = await services.getAllUsers('Dukun Cuaca');
    if (!listUsers?.data?.length) throw new Error('There are no users');
    
    await Promise.all(
      listUsers.data.map(async (user) => {
        try {
          const result = await services.fetchWeather(user);
          
          const userLocation = user.location;
          const dateNowStamps = Math.floor(new Date().getTime() / 1000);
          const dateNow = formatTimestampToTime(dateNowStamps, userLocation).date;

          const resultMap = {
            location: result.city.name,
            list: result.list
              .filter((entry) => formatTimestampToTime(entry.dt, userLocation).date.startsWith(dateNow))
              .map(({ dt, dt_txt, weather, main }) => {
                const { time, date } = formatTimestampToTime(dt, userLocation);
                return {
                  time,
                  date,
                  original_time: dt_txt,
                  weather_main: weather[0].main,
                  weather_description: weather[0].description,
                  temp: Math.floor(parseFloat(main.temp) - 273.15)
                };
              }),
          };

          const text = services.generateTextDukunCuaca(resultMap, userLocation, dateNow);
          await bot.sendMessage(user.chat_id, text, { parse_mode: 'Markdown'});
        } catch (error) {
          console.error(`${user.username} cannot send: ${error.message}`);
        };
      })
    );
    res.status(resources.httpStatus.success).json({...resources.successMessage });
  } catch (error) {
    res.status(resources.httpStatus.error).json({ ...resources.errorFetch, error: error.message });
  }
};

module.exports = {
  sendMessageController,
  webHookController,
  dukunCuacaController
};
