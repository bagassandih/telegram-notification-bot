// Setup supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const tableChatId = process.env.TABLE_NAME_CHAT_ID;

// Repository for inserting new user
async function insertDataUser(chatId, username, settings, location) {
  return await supabase
    .from('chat_ids_telegram')
    .insert({ chat_id: chatId, username: username, settings: settings, location: location});
}

// Repository for getting all data users based on type message
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

// Repository for update users
async function updateDataUser(chatId, username, location) {
  return await supabase
    .from('chat_ids_telegram')
    .update({ location: location })
    .eq('chat_id', chatId)
    .eq('username', username);
}

// Repository for checking existing user before insert new user
async function checkExistingDataUsers(chatId, username) {  
  let query = supabase.from(tableChatId).select("chat_id, username");

  if (chatId) query = query.eq("chat_id", chatId);
  if (username) query = query.eq("username", username);

  return await query.maybeSingle();
}

module.exports = {
  insertDataUser,
  getAllDataUsers,
  checkExistingDataUsers,
  updateDataUser
};
