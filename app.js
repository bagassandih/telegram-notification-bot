// Setup server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Import controllers
const controllers = require('./controllers');

// Use middleware
app.use(cors());
app.use(express.json());

// Setup Bot
const TelegramBot = require('node-telegram-bot-api');
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
// Initialize bot without polling
const bot = new TelegramBot(telegramBotToken);

// Set webhook URL - gunakan ini saat deployment
const publicUrl = process.env.TELEGRAM_PUBLIC_URL; 
const webhookPath = `/webhook/${telegramBotToken}`;
const webhookUrl = `${publicUrl}${webhookPath}`;
bot.setWebHook(webhookUrl).then(() => {
    console.log('Webhook set successfully');
}).catch((error) => {
    console.error('Failed to set webhook:', error);
});

// Webhook endpoint to receive updates
app.post(`/webhook/${telegramBotToken}`, async (req, res) => {
    try {
        const { message } = req.body;
        console.log(message);
        if (!message) {
            return res.sendStatus(200);
        }

        // Handle /start command
        if (message.text === '/start') {
            await controllers.onStartController(bot, message);
        }
        
        res.sendStatus(200);
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.sendStatus(500);
    }
});

// API endpoint untuk mengirim pesan
app.post('/send', (req, res) => controllers.sendMessageController(bot, req, res));

// Endpoint untuk health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Jika running di environment serverless, export app
if (process.env.SERVERLESS) {
    module.exports = app;
} else {
    // Jika running sebagai standalone server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}