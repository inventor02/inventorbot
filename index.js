// InventorBot
// Coded by inventor02
// Copyright 2016 George Peppard
// Licensed under the MIT license

// Require
var Discord = require('discord.js');
var bot = new Discord.Client({
    autoReconnect: true
});
var token = require('./auth.json');

// Variables
var VERSION = "1.0";
var DEBUGGING = false;

// Formatter for messages
var format = function (user, message) {
    var formattedMessage = user.mention() + " :computer: " + message;

    return formattedMessage;
};

// Commands
var commands = {
    "help": {
        "func": function (message) {
            bot.sendMessage(message.author, [
                "**Hi there! I'm InventorBot, a bot coded by inventor02 to make life easier**",
                "At the moment, you can't add me to your server, but it's coming soon!",
                "",
                "__Commands List__",
                "`-help`: `Sends this message!`",
                "`-hi`: `Sends the hi message!`"
            ]);

            bot.sendMessage(message.channel, format(message.author, "I've sent you the help in a PM!"));
        }
    },
    "hi": {
        "func": function (message) {
            bot.sendMessage(message.channel, format(message.author, "Hey there! Use -help to see my commands!"));
        }
    },
    "stop": {
        "func": function (message) {
            if(message.author.id === "97375580084764672") {
                bot.sendMessage(message.channel, format(message.author, "Bot shutting down!"));
                bot.setPlayingGame("Going offline");
                bot.setStatusAway();
                setTimeout(function () {
                    process.exit(0);
                }, 5000);
            } else {
                bot.sendMessage(message.channel, format(message.author, "Insufficient permission! Your actions have been logged. What a....twist?"));
                console.info("InventorBot > " + message.author.name + " tried to run .stop without permission!");
            }
        }
    }
};

// Events
bot.on('ready', function () {
    bot.startTyping();

    console.info("InventorBot > A fun and simple discord bot that is easy to use!");
    console.info("InventorBot > Logging in...");
    console.info("InventorBot > Logged in successfully!");

    bot.setPlayingGame("InventorBot v" + VERSION);
    bot.setStatusAvailable();
    
    if(DEBUGGING) {
        console.warn("InventorBot > Debug logging is enabled. This is NOT recommended for production use, and will be stated in all #botannouncements channels!");
        bot.sendMessage(bot.channels.get("name", "botannouncements").id, "**InventorBot:** Debug logging is enabled, and is not recommended for production use!");
    }

    console.info("InventorBot > Announcing bot readiness in all #botannouncement channels!");
    for(var i = 0; i < bot.channels.length; i++) {
        var channel = bot.channels[i];

        if(channel.name === "botannouncements") {
            bot.sendMessage(channel, "**InventorBot:** Ready to serve users! Serving users in " + bot.channels.length + " channels and " + bot.servers.length + " servers!");
        }
    }

    console.info("InventorBot > Ready to serve users! Serving users in " + bot.channels.length + " channels and " + bot.servers.length + " servers!")

    bot.stopTyping();
});

bot.on('message', function (message) {
    if(message.content.indexOf("-") === 0) {
        var words = message.content.slice(1).split(" ");
        var cmd = commands[words.shift()];
        if(cmd !== undefined) {
            cmd.func(message);
        } else {
            bot.sendMessage(message.channel, format(message.author, "Unknown command! Type `-help` for help."));
        }
    }
});

bot.loginWithToken(token.token);