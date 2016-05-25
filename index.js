// InventorBot
// Coded by inventor02
// Copyright 2016 George Peppard
// Licensed under the MIT license
// All rights reserved

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
        "func": function (message, args) {
            bot.sendMessage(message.author, [
                "**Hi there! I'm InventorBot, a bot coded by inventor02 to make life easier**",
                "At the moment, you can't add me to your server, but it's coming soon!",
                "",
                "__Commands List__",
                "`-help`: `Sends this message!`",
                "`-hi`: `Sends the hi message!`",
                "`-stop`: `Admin Only: Stops the bot`",
                "`-status`: `Admin Only: Changes the bot status`",
                "`-announce`: `Admin Only: Announces something in all #botannouncements channels!`"
            ]);

            bot.sendMessage(message.channel, format(message.author, "I've sent you the help in a PM!"));
        }
    },
    "hi": {
        "func": function (message, args) {
            bot.sendMessage(message.channel, format(message.author, "Hey there! Use -help to see my commands!"));
        }
    },
    "stop": {
        "func": function (message, args) {
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
    },
    "status": {
        "func": function (message, args) {
            if(message.author.id === "97375580084764672") {
                if(args.length < 1) {
                    bot.sendMessage(message.channel, format(message.author, "Incorrect arguments!"));
                } else {
                    var final = "";

                    if(args[0] === "default") {
                        bot.sendMessage(message.channel, format(message.author, "Set game to InventorBot v" + VERSION));
                        setTimeout(function () {
                            bot.setPlayingGame("InventorBot v" + VERSION);
                        }, 1000);

                        return;
                    }

                    bot.sendMessage(message.channel, format(message.author, "Set game to " + args.join(" ")));
                    setTimeout(function () {
                        bot.setPlayingGame(args.join(" "));
                    }, 1000);
                }
            } else {
                bot.sendMessage(message.channel, format(message.author, "Insufficient permission! Your actions have been logged. What a....twist?"));
                console.info("InventorBot > " + message.author.name + " tried to run .status without permission!");
            }
        }
    },
    "announce": {
        "func": function (message, args) {
            if(message.author.id === "97375580084764672") {
                if(args.length < 1) {
                    bot.sendMessage(message.channel, format(message.author, "Incorrect arguments!"));
                } else {
                    bot.sendMessage(message.channel, format(message.author, "Announcing in all #botannouncements channels!"));

                    for(var i = 0; i < bot.channels.length; i++) {
                        var channel = bot.channels[i];

                        if(channel.name === "botannouncements") {
                            bot.sendMessage(channel, "**InventorBot:** " + args.join(" "));
                        }
                    }

                    bot.sendMessage(message.channel, format(message.author, "Complete!"));
                }
            } else {
                bot.sendMessage(message.channel, format(message.author, "Insufficient permission! Your actions have been logged. What a....twist?"));
                console.info("InventorBot > " + message.author.name + " tried to run .status without permission!");
            }
        }
    }
};

// Events
bot.on('ready', function () {
    console.info("InventorBot > A fun and simple discord bot that is easy to use!");
    console.info("InventorBot > Logging in...");
    console.info("InventorBot > Logged in successfully!");

    bot.setStatusAvailable();
    
    if(DEBUGGING) {
        console.warn("InventorBot > Debug logging is enabled. This is NOT recommended for production use, and will be stated in all #botannouncements channels!");
        bot.sendMessage(bot.channels.get("name", "botannouncements").id, "**InventorBot:** Debug logging is enabled, and is not recommended for production use!");
    }

    console.info("InventorBot > Announcing bot readiness in all #botannouncement channels!");
    for(var i = 0; i < bot.channels.length; i++) {
        var channel = bot.channels[i];

        if(channel.name === "botannouncements") {
            bot.sendMessage(channel, "**InventorBot:** Ready to begin public servicing! Serving users in " + bot.channels.length + " channels and " + bot.servers.length + " servers!");
        }
    }

    bot.setPlayingGame("InventorBot v" + VERSION);

    console.info("InventorBot > Ready to serve users! Serving users in " + bot.channels.length + " channels and " + bot.servers.length + " servers!");
});

bot.on('message', function (message) {
    if(message.content.indexOf("-") === 0) {
        var words = message.content.slice(1).split(" ");
        var cmd = commands[words.shift()];
        if(cmd !== undefined) {
            cmd.func(message, words);
        } else {
            bot.sendMessage(message.channel, format(message.author, "Unknown command! Type `-help` for help."));
        }
    }
});

bot.loginWithToken(token.token);

// Coded with JavaScript, Node.js and discord.js by inventor02
// Made with <3 in London, England