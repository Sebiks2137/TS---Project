const fs = require('fs');
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require('discord.js');

const { ruleEmbed1, ruleEmbed2, ruleEmbed3 } = require('../data/regEmbeds');

module.exports = {
  name: 'regulamin',
  aliases: ['reg', 'rg'],
  category: 'misc',
  description: 'Wysyła interaktywny regulamin.',
  expectedArgs: '[channel]',
  expectedArgsTypes: ['CHANNEL'],
  minArgs: 1,
  maxArgs: 1,
  syntaxError: 'Poprawne uzycie: {PREFIX}regulamin [kanał]',
  permissions: ['ADMINISTRATOR'],
  testOnly: true,
  guildOnly: true,
  slash: 'both',

  init: (client) => {
    client.on('interactionCreate', async (interaction) => {
      const { customId, values } = interaction;

      if (!interaction.isSelectMenu() || customId !== 'reg_menu') {
        return;
      }

      if (customId === 'reg_menu') {
        let msgId;

        fs.readFile('src/data/regMsg.json', 'utf-8', (err, fileData) => {
          if (err) {
            console.log(err);
          }

          try {
            const data = JSON.parse(fileData);
            msgId = data.msgId;
          } catch (err) {
            console.log(err);
          }

          if (interaction.message.id !== msgId) {
            return;
          }

          let ruleEmbeds = [];

          for (const id of values) {
            switch (id) {
              case '1':
                ruleEmbeds.push(ruleEmbed1);
                break;
              case '2':
                ruleEmbeds.push(ruleEmbed2);
                break;
              case '3':
                ruleEmbeds.push(ruleEmbed3);
                break;
            }
          }

          if (ruleEmbeds.length === 0) {
            interaction.reply({
              content: 'Wybrane działy zostały odznaczone.',
              ephemeral: true,
            });
            return;
          }

          ruleEmbeds.sort((a, b) =>
            a.title > b.title ? 1 : b.title > a.title ? -1 : 0
          );

          interaction.reply({
            embeds: ruleEmbeds,
            ephemeral: true,
          });
        });
      }
    });
  },

  callback: async ({ message, interaction }) => {
    const channel = message
      ? message.mentions.channels.first()
      : interaction.options.getChannel('channel');
    if (!channel || channel.type !== 'GUILD_TEXT') {
      return 'Proszę oznaczyć kanał tekstowy.';
    }

    if (interaction) {
      interaction.reply({
        content: 'Wysłano regulamin!',
        ephemeral: true,
      });
    } else {
      message.reply('Wysłano regulamin!');
    }

    const embed = new MessageEmbed()
      .setColor('#fffffe')
      .setTitle('Regulamin!')
      .setDescription('Opis...');

    let msg = await channel.send({
      embeds: [embed],
    });

    const row = new MessageActionRow();

    const options = [
      {
        label: 'Dział §1 regulaminu.',
        description: 'Punkty 1-10 działu §1.',
        emoji: '1️⃣',
        value: '1',
      },
      {
        label: 'Dział 2 regulaminu.',
        description: 'Punkty 1-10 działu §2.',
        emoji: '2️⃣',
        value: '2',
      },
      {
        label: 'Dział 3 regulaminu.',
        description: 'Punkty 1-10 działu §3.',
        emoji: '3️⃣',
        value: '3',
      },
    ];

    row.addComponents(
      new MessageSelectMenu()
        .setCustomId('reg_menu')
        .setMinValues(0)
        .setMaxValues(options.length)
        .setPlaceholder('Wybierz dział regulaminu...')
        .setOptions(options)
    );

    await msg.edit({
      components: [row],
    });

    const newObject = {
      msgId: msg.id,
    };

    fs.writeFile(
      'src/data/regMsg.json',
      JSON.stringify(newObject, null, 2),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  },
};
