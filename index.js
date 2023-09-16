const { exec } = require('child_process');
const TelegramBot = require('node-telegram-bot-api');
const system_config = require('./system_config');

const token = '6572422963:AAEb0NOp7-MEKExZxqanUGBxzkguFQkiAyc';

const activeServers = system_config.active_servers;

const maxMessageLength = 4000;

const bot = new TelegramBot(token, { polling: true });
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const sender_info = msg.chat.username;
  
  let message = ""
  message = `\n\n<b>Patch Commands</b>\n***************************`;
  for (let i = 0; i < activeServers.length; i++) {
      let upper = String.prototype.toUpperCase.call(activeServers[i]);
      message += `\n<b>${upper}</b> → /patch_${activeServers[i]}`;
  }

  if (msg.text === '/start' || msg.text === '/menu') {

    bot.sendMessage(chatId, `Hello! @${sender_info}${message}`, { parse_mode: 'HTML' });
    return;
  }else {
    try {

      let patch_mess = "";
      patch_mess = `\nPlease be careful to patching`;
      let check = "";
      let check_admin= "";
      let check_front = "";
      for (let i = 0; i < activeServers.length; i++) {
        check = `/${activeServers[i]}check`;
        check_front = `/${activeServers[i]}checkFront`;
        check_admin = `/${activeServers[i]}checkAdmin`;

        dev_front = `/${activeServers[i]}FrontDev`;
        dev_admin = `/${activeServers[i]}AdminDev`;

        if (msg.text == check) {
         
          bot.sendMessage(chatId,`\nChoose Patch\n(note: this is patch is for check)\nFront → ${check_front}\nAdmin → ${check_admin}`, { parse_mode: 'HTML' });

          return;
        }
        if (msg.text == check_front) {
          bot.sendMessage(chatId, "Please wait for response!.", { parse_mode: 'HTML' });
          execCom(`cd /home/${activeServers[i]} && sudo ./dist.sh`,chatId,dev_front);
          return;
        }
        if (msg.text == check_admin) {

          execCom(`cd /home/${activeServers[i]} && sudo ./dist_odds_admin.sh`,chatId,dev_admin);
          return;
        }
        if (msg.text == dev_front) {

          execCom(`cd /home/${activeServers[i]} && sudo ./dist_front_live.sh`,chatId,"0");
          return;
        }

        if (msg.text == dev_admin) {

          execCom(`cd /home/${activeServers[i]} && sudo ./dist_odds_admin_live.sh`,chatId,"0");
          return;
        }
  
      }
    
      let post_mess = "";
      const parts = msg.text.split('_');
      const sample = parts[1];
      let uppercase = String.prototype.toUpperCase.call(sample);
      post_mess += `\nYou want to patch "${uppercase} live"`;
      post_mess += `\nPlease check before patch "${uppercase} live"`;
      post_mess += `\ncheck "${uppercase}" ( click here /${sample}check )`;
      post_mess += `\nBack to /menu`;
      
      bot.sendMessage(chatId, `${post_mess}`, { parse_mode: 'HTML' });

    } catch (error) {

      console.error("An error occurred:", error);
    }
  
  }

});

function execCom(msg,chatId,patchlive){
  let bck_mess = `\n\nPatch to Dev → ${patchlive}`;

  exec(msg, (error, stdout, stderr) => {
    if (error) {

      bot.sendMessage(chatId,  `Error: ${error.message}`, { parse_mode: 'HTML' });
    }
    if (stderr) {

      console.error(`Stderr: ${stderr}`);

    }
    if (patchlive == "0") {
      bck_mess = `\n`;
    }
    const limitedMessage = limitMessageLength(stdout);

    bot.sendMessage(chatId, `${limitedMessage}${bck_mess}\nBack to → /menu`, { parse_mode: 'HTML' });
   
  });
}

function limitMessageLength(message) {
  if (message.length > maxMessageLength) {
    return message.substring(0, maxMessageLength); // Truncate the message
  }
  return message; // Message is within the limit
}
