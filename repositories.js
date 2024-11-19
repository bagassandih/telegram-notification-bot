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
  const { data, error } =  await supabase
    .from('chat_ids_telegram')
    .insert({ chat_id: chatId, username: username, settings: settings, location: location});

    if (error) console.error(error.message);
    return data;
}

// Repository for getting all data users based on type message
async function getAllDataUsers(typeMessage) {
  const settingMap = {
    'Auto Faucet': 'autoFaucet',
    'Dukun Cuaca': 'dukunCuaca',
  };

  const settingType = settingMap[typeMessage];
  if (!settingType) throw new Error('Invalid setting, need type of message');

  let query = supabase
    .from(tableChatId)
    .select('*')
    .eq(`settings->>${settingType}`, true)
    
  if (settingType === 'dukunCuaca') query = query.not('location->>timeZone', 'is', null);
  
  return await query;
}

// Repository for update users
async function updateDataUser(chatId, username, updateFields) {
  // Setup valid input fields
  const validFields = {};

  for (const [key, value] of Object.entries(updateFields)) {
    if (value != null && value !== '') validFields[key] = value; 
  };

  const { data, error} = await supabase
    .from('chat_ids_telegram')
    .update( validFields ) 
    .eq('chat_id', chatId)
    .eq('username', username);

    if (error) console.error(error.message);
    return data;
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
