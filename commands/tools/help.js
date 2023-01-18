const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help me!'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        author = interaction.user.id;
        console.log(`User ${author} used /help command!`);

        const newMessage = `can't help u lol.`
        await interaction.editReply({
            content: newMessage
        });
    }
}