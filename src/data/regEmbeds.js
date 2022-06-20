const { MessageEmbed } = require('discord.js');

const ruleEmbed1 = new MessageEmbed()
  .setColor('#fffffe')
  .setTitle('Dział 1')
  .setDescription('Dział 1 regulaminu!');

const ruleEmbed2 = new MessageEmbed()
  .setColor('#fffffe')
  .setTitle('Dział 2')
  .setDescription('Dział 2 regulaminu!');

const ruleEmbed3 = new MessageEmbed()
  .setColor('#fffffe')
  .setTitle('Dział 3')
  .setDescription('Dział 3 regulaminu!');

module.exports = { ruleEmbed1, ruleEmbed2, ruleEmbed3 };
