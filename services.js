require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const tableChatId = process.env.TABLE_NAME_CHAT_ID;

async function onStart(msg) {
    const chatId = msg.chat.id; 
    const username = msg.from.username; 
    
    const { data, error: selectError } = await supabase
      .from(tableChatId)
      .select('chat_id, username')
      .eq('chat_id', chatId)
      .eq('username', username)
      .single();
    
    if (selectError) {
      console.error(`Error while checking data: ${selectError.message}`);
    } else if (data) {
      console.error(`${username}:${chatId} already exists`);
    } else {
      const { error } = await supabase
        .from('chat_ids_telegram')
        .insert({ chat_id: chatId, username: username });
    
      if (error) {
        console.error(`Error inserting data: ${error.message}`);
      } else {
        console.log('Data inserted successfully');
      }
    }
}

async function onSend() {
    const listUsers = await supabase
        .from(tableChatId)
        .select('chat_id');
        
    if (!listUsers?.data) throw new Error('There are no users');
    return listUsers;
}

module.exports = {
  onStart,
  onSend,
};