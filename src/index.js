const DJS = require('discord.js');
const CH = require('wokcommands');
const path = require('path');

require('dotenv/config');

const client = new DJS.Client({
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_PRESENCES',
  ],
});

client.on('ready', () => {
  console.log('Bot jest gotowy!');

  new CH(client, {
    commandsDir: path.join(__dirname, 'commands'),
    testServers: ['988424957577003048'],
    disabledDefaultCommands: [
      'help',
      'command',
      'language',
      'prefix',
      'requiredrole',
      'channelonly',
    ],
  }).setDefaultPrefix('?');
});

client.login(process.env.TOKEN);
