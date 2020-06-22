module.exports = {
  name: 'up',
  description: 'Just a test to see if the server is awake.',
  aliases: ['awake', 'check', 'uptime'],
  displayInHelp: false,
  execute(message, bot, db) {
    let uptime = Math.round(bot.uptime * 100) / 100 / 1000;

    if (uptime > 60 && uptime < 3600) {
      uptime = uptime / 60;
      message.channel.send(
        `I've been awake for ` + uptime.toFixed(0) + ` minutes*...minutes...*`,
      );
    } else if (uptime > 3600) {
      uptime = uptime / 60 / 60;
      message.channel.send(
        `I've been awake for ` + uptime.toFixed(0) + ` hours*...hours...*`,
      );
    } else {
      message.channel.send(
        `I've only been awake for ` +
          uptime.toFixed(0) +
          ` seconds...*seconds...*`,
      );
    }
  },
};
