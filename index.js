const { exec } = require('child_process');
const TelegramBot = require('node-telegram-bot-api');
const system_config = require('./system_config');

const token = '6572422963:AAEb0NOp7-MEKExZxqanUGBxzkguFQkiAyc';

const activeServers = system_config.active_servers;

const bot = new TelegramBot(token, { polling: true });
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const sender_info = msg.chat.username;

  let message = ""
  if (msg.text === '/start') {
    message = `\n\nPatch Commands`;
    message += `\n/patch`;
    message += `\n/create_bash`;
    bot.sendMessage(chatId, `Hello! @${sender_info}${message}`);
    return;
    
  }if (msg.text === '/create_bash') {

    for (let i = 0; i < activeServers.length; i++) {
      const serverName = activeServers[i];
      
      exec(`bash /opt/telegram-bot/bash-scipts${msg.text}.sh`, (error, stdout, stderr) => {
        if (error) {
  
          bot.sendMessage(chatId,  `Error: ${error.message}`);
        }
        if (stderr) {
  
          console.error(`Stderr: ${stderr}`);
  
        }
  
        bot.sendMessage(chatId, `${stdout}`);
      });

      bot.sendMessage(chatId,  `Creating bash script! : ${serverName}`);
     
    }

  }else {

    exec(msg.text, (error, stdout, stderr) => {
      if (error) {

        bot.sendMessage(chatId,  `Error: ${error.message}`);
      }
      if (stderr) {

        console.error(`Stderr: ${stderr}`);

      }

      bot.sendMessage(chatId, `${stdout}`);
  });

  
  }

});
