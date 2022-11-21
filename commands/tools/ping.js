const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Return my ping!'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const newMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        
        author = interaction.user.id;
        console.log(`User ${author} used /ping command!`);
        await interaction.editReply({
            content: newMessage
        });
    }
}