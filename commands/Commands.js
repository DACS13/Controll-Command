const { exec } = require('child_process');

module.exports      = class Commands
{
    setCommand()
    {
        const bashCommand  = '/opt/telegram-bot/bash-scipts/';


        exec(`bash ${bashCommand}patch.sh`, (error, stdout, stderr) => {
            if (error) {
              return  `Error: ${error.message}`;
              // return;
            }
            if (stderr) {
              return `Stderr: ${stderr}`;
             
            }
            return `Stdout: ${stdout}`;
        });
    }
}