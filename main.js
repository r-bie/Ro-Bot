require('dotenv').config();

const { token, mongoToken } = process.env;
const fs = require('fs');
const { connect } = require('mongoose');

const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require(`discord.js`);
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./functions`);
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./functions/${folder}`).filter((file) => file.endsWith(".js"));

    for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token);
(async () => {
    await connect(mongoToken).catch(console.error);
})();