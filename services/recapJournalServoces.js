const utilities = require('../utilities');

// Insert new sheet
async function fetchSpreadSheet(data) {
  const baseUrl = process.env.SPREADSHEET_URL;

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseJson = await response.json();
  console.log('🚀 Recap Journal Fetched: ', responseJson?.message);
  return responseJson;s
}

module.exports = {
  fetchSpreadSheet,
};

