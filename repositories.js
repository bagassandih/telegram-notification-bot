require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const tableChatId = process.env.TABLE_NAME_CHAT_ID;

async function insertDataUser(chatId, username) {
  return await supabase
    .from('chat_ids_telegram')
    .insert({ chat_id: chatId, username: username });
}

async function getAllDataUsers(typeMessage) {
  const settingMap = {
    'Auto Faucet': 'autoFaucet',
    'Dukun Cuaca': 'dukunCuaca',
  };

  const settingType = settingMap[typeMessage];
  if (!settingType) throw new Error('Invalid setting, need type of message');

  return await supabase
    .from(tableChatId)
    .select('*')
    .eq(`settings->>${settingType}`, 'true');
}

async function checkExistingDataUsers(chatId, username) {  
    let query = supabase.from(tableChatId).select('chat_id, username');

    if (chatId) query = query.eq('chat_id', chatId);
    if (username) query = query.eq('username', username);

    return await query.maybeSingle();
}

module.exports = {
  insertDataUser,
  getAllDataUsers,
  checkExistingDataUsers,
};
