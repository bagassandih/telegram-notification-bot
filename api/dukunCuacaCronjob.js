const { dukunCuacaController } = require('../controllers');

export default function handler(req, res) {
    // Logika cron job Anda di sini
    console.log("Cron job executed!");
  
    // Contoh response
    res.status(200).json({ message: "Cron job executed successfully!" });
  }
  
  export const config = {
    runtime: 'edge',
    schedule: '30 4 * * *',
  };

  