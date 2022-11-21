const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help me!'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        })
        const newMessage = `This is help command`
        await interaction.editReply({
            content: newMessage
        });
    }
}