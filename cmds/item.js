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
  name: 'item',
  aliases: ['i', 'items'],
  description: 'Searches for the requested item.',
  args: true,
  displayInHelp: true,
  execute(message, args) {
    search = args.join(' ');
    let pages = [];
    let options = [];
    let itemUrl = 'https://api.nooks.cafe/api/item/' + search;
    request(itemUrl, options, function (err, res, body) {
      let searchResult = JSON.parse(body);
      for (i = 0; i < searchResult.length; i++) {
        let foundItem = searchResult[i];

        let variants = foundItem.variants;
        let defaultVariant = variants[0];

        //Set the easy fields
        let itemName = _.startCase(foundItem.name);
        let itemSize = foundItem.size;
        let itemCategory = foundItem.sourceSheet;
        let itemBuy = defaultVariant.buy;
        let itemSell = defaultVariant.sell;
        let itemTag = foundItem.tag;
        let itemImage = defaultVariant.image;
        let itemSource = defaultVariant.source;

        //set Buy Value
        if (itemBuy === -1) {
          itemBuy = 'N/A';
        } else {
          itemBuy = itemBuy + ' bells';
        }

        //Set color variants
        let itemColors = [];
        variants.forEach((variant) => {
          let formattedColor = variant.colors.join('/');
          itemColors.push(formattedColor);
        });

        // Set Tags
        if (itemTag === undefined || itemTag === null) {
          itemTag = 'No Tags';
        }

        let embedData = {};

        let object = {
          name: 'item',
          content: new Discord.MessageEmbed({
            title: itemName,
            color: rcolor(),
            fields: [
              {
                name: 'Size',
                value: itemSize,
                inline: true,
              },
              {
                name: 'Sell',
                value: itemSell + ' bells',
                inline: true,
              },
              {
                name: 'Buy',
                value: itemBuy,
                inline: true,
              },
              {
                name: 'Source',
                value: itemSource,
                inline: true,
              },
              {
                name: 'Category',
                value: itemCategory,
                inline: true,
              },
              {
                name: 'Tags',
                value: itemTag,
              },
            ],
            thumbnail: {
              url: itemImage,
            },
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
