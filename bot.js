console.log(`======== Starting Nook's Cafe Bot ========`);
const Discord = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();
const prefix = process.env.PREFIX;
const request = require('request');
const rcolor = require('rcolor');
const mongoose = require('mongoose');
const fs = require('fs');
const _ = require('lodash');

let servers = {};

/***********************************************************
 *******************  Discord Bot Setup  *******************
 ***********************************************************/

//Create bot client and register commands from the 'cmds' folder
const bot = new Discord.Client();
bot.cmds = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./cmds')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./cmds/${file}`);
  bot.cmds.set(command.name, command);
}

//When ready, log on, build invite link and set initial activity.
bot.on('ready', async function () {
  console.log(`Logged in as ${bot.user.tag}`);

  changeSong();

  let minLink = await bot.generateInvite(379968);
  let maxLink = await bot.generateInvite('ADMINISTRATOR');
  //console.log('Invite Nookbot with Minimal permissions: ' + minLink);
  console.log('Invite NookBot with Full Admin: ' + maxLink);
  //console.log
});

/*********************************************************
 *******************  Message Handler  *******************
 *********************************************************/

bot.on('message', async (message) => {
  var server = servers[message.guild.id];

  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  if (!message.content.startsWith(prefix)) return;
  const command =
    bot.cmds.get(commandName) ||
    bot.cmds.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) {
    return message.reply(
      `This command doesn't exist. Use **${process.env.PREFIX}help** to see all commands.`,
    );
  }

  if (command.args && !args.length) {
    return message.channel.send('You forgot to enter a search!');
  }

  try {
    command.execute(message, args);
  } catch (e) {
    console.error(e);
    message.reply(
      'There was an issue running this command. Please try again later.',
    );
  }
});

/***************************************************
 *******************  Bot Login  *******************
 ***************************************************/

bot.login(process.env.BOT_TOKEN);

/***************************************************
 *******************  Functions  *******************
 ***************************************************/

function selectSong() {
  let trackList = [
    'Agent K.K.',
    'Aloha K.K.',
    'Animal City',
    'Bubblegum K.K.',
    'Café K.K.',
    'Comrade K.K.',
    'DJ K.K.',
    "Drivin'",
    'Farewell',
    'Forest Life',
    'Go K.K. Rider',
    'Hypno K.K.',
    'I Love You',
    'Imperial K.K.',
    'K.K. Adventure',
    'K.K. Aria',
    'K.K. Ballad',
    'K.K. Bazaar',
    'K.K. Birthday',
    'K.K. Blues',
    'K.K. Bossa',
    'K.K. Calypso',
    'K.K. Casbah',
    'K.K. Chorale',
    'K.K. Condor',
    "K.K. Cruisin'",
    'K.K. D&B',
    'K.K. Dirge',
    'K.K. Disco',
    'K.K. Dixie',
    'K.K. Étude',
    'K.K. Faire',
    'K.K. Flamenco',
    'K.K. Folk',
    'K.K. Fusion',
    'K.K. Groove',
    'K.K. Gumbo',
    'K.K. House',
    'K.K. Island',
    'K.K. Jazz',
    'K.K. Jongara',
    'K.K. Lament',
    'K.K. Love Song',
    'K.K. Lullaby',
    'K.K. Mambo',
    'K.K. Marathon',
    'K.K. March',
    'K.K. Mariachi',
    'K.K. Metal',
    'K.K. Milonga',
    'K.K. Moody',
    'K.K. Oasis',
    'K.K. Parade',
    'K.K. Ragtime',
    'K.K. Rally',
    'K.K. Reggae',
    'K.K. Rock',
    'K.K. Rockabilly',
    'K.K. Safari',
    'K.K. Salsa',
    'K.K. Samba',
    'K.K. Ska',
    'K.K. Sonata',
    'K.K. Song',
    'K.K. Soul',
    'K.K. Steppe',
    'K.K. Stroll',
    'K.K. Swing',
    'K.K. Synth',
    'K.K. Tango',
    'K.K. Technopop',
    'K.K. Waltz',
    'K.K. Western',
    'King K.K.',
    'Lucky K.K.',
    'Marine Song 2001',
    'Mountain Song',
    'Mr. K.K.',
    'My Place',
    'Neapolitan',
    'Only Me',
    'Pondering',
    "Rockin' K.K.",
    'Soulful K.K.',
    'Space K.K.',
    'Spring Blossoms',
    'Stale Cupcakes',
    'Steep Hill',
    "Surfin' K.K.",
    'The K. Funk',
    'To the Edge',
    'Two Days Ago',
    'Wandering',
    'Welcome Horizons',
    'Hazure01',
    'Hazure02',
    'Hazure03',
  ];

  let selectedSong = trackList[Math.floor(Math.random() * trackList.length)];

  bot.user.setActivity(selectedSong, { type: 'LISTENING' });
}

async function changeSong() {
  selectSong();
  let timerID = setInterval(selectSong, 210000);
}
