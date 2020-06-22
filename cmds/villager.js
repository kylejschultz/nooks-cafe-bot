const Discord = require('discord.js');
const _ = require('lodash');
const rcolor = require('rcolor');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Menu } = require('discord.js-menu');
const request = require('request');
require('express-async-errors');
dotenv.config();

module.exports = {
  name: 'villager',
  aliases: ['v', 'villagers'],
  description: 'Searches for the requested villager.',
  args: true,
  displayInHelp: true,
  execute(message, args) {
    search = args.join(' ');
    let pages = [];
    let options = [];
    let itemUrl = 'https://api.nooks.cafe/api/villager/' + search;
    request(itemUrl, options, function (err, res, body) {
      let searchResult = JSON.parse(body);
      for (i = 0; i < searchResult.length; i++) {
        let foundVillager = searchResult[i];

        //Set the easy fields
        let data = {
          name: _.upperFirst(foundVillager.name),
          species: foundVillager.species,
          gender: foundVillager.gender,
          genderPronoun: '',
          personality: foundVillager.personality,
          hobby: foundVillager.hobby,
          birthday: foundVillager.birthday,
          catchphrase: foundVillager.catchphrase,
          favoriteSong: foundVillager.favoriteSong,
          styles: foundVillager.styles.join(', '),
          vilImage: foundVillager.iconImage,
          houseImage: foundVillager.houseImage,
        };

        if (data.gender === 'Female') {
          data.genderPronoun = 'she';
        } else {
          data.genderPronoun = 'he';
        }

        let descriptionText = `${data.name} is a ${_.lowerFirst(
          data.gender,
        )} ${_.lowerFirst(data.species)} who was born on ${
          data.birthday
        }. \n${_.upperFirst(data.genderPronoun)} is a ${
          data.personality
        } villager whose hobby is ${_.lowerFirst(data.hobby)}.`;

        let object = {
          name: 'villager' + i,
          content: new Discord.MessageEmbed({
            title: data.name,
            color: rcolor(),
            thumbnail: {
              url: data.houseImage,
            },
            image: {
              url: data.vilImage,
            },
            description: descriptionText,
            fields: [
              {
                name: 'Catchphrase',
                value: _.startCase(data.catchphrase),
              },
              {
                name: 'Favorite Song',
                value: data.favoriteSong,
              },
            ],
            footer: {
              text: 'Result ' + (i + 1) + '/' + searchResult.length,
            },
          }),
          reactions: {
            '⏮️': 'first',
            '⏪': 'previous',
            '⏩': 'next',
            '⏭️': 'last',
          },
        };

        pages.push(object);
      }
      new Menu(message.channel, message.author.id, pages);
    });
  },
};
