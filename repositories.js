require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const tableChatId = process.env.TABLE_NAME_CHAT_ID;

async function insertDataUser(chatId, username) {
    return await supabase
      .from("chat_ids_telegram")
      .insert({ chat_id: chatId, username: username });
  }
  
  async function getAllDataUsers() {
    return await supabase
      .from(tableChatId)
      .select("chat_id");
  }
  
  async function checkExistingDataUsers(chatId, username) {
    return await supabase
      .from(tableChatId)
      .select("chat_id, username")
      .eq("chat_id", chatId)
      .eq("username", username)
      .single();
  }

  module.exports = {
    insertDataUser,
    getAllDataUsers,
    checkExistingDataUsers,
  }