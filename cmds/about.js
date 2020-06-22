const Discord = require('discord.js');
const _ = require('lodash');
const rcolor = require('rcolor');

module.exports = {
  name: 'about',
  aliases: [],
  description: 'About NookBot',
  args: false,
  displayInHelp: true,
  execute(message, args) {
    // Build embed
    let embed = new Discord.MessageEmbed();
    embed.setTitle('About NookBot');
    embed.setColor(rcolor());

    embed.setFooter('About NookBot');
    embed.setDescription(
      'NookBot was created by ***@Gurthyy#8735*** using Discord.JS and MongoDB is used for the backend database. Data provided from the ACNH Spreadsheet: https://tinyurl.com/acnh-sheet ',
    );
    message.channel.send(embed);
  },
};
