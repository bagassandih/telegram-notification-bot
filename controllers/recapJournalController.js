const recapJournalServices = require('../services/recapJournalServoces');
const resources = require('../resources.json');

async function recapJournalController(req, res) {
  try {
    const data = req.body;
    if (data?.length > 0) {
        recapJournalServices.fetchSpreadSheet(data);
    }
    res
      .status(resources.httpStatus.success)
      .json({ ...resources.successFetch });
  } catch (error) {
    res
      .status(resources.httpStatus.error)
      .json({ ...resources.errorFetch, error: error.message });
  }
}

module.exports = {
  recapJournalController,
};

