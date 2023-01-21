const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Details about the discord server.'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        author = interaction.user.id;
        console.log(`[logdata]User ${author} used /about command!`);

        const newMessage = `Discord Server with bots created by Robie#3795.\nLike my work? You can support me here:\n0xB001Cd61533c94d9afC914a069E600347E0eFbF0`
        await interaction.editReply({
            content: newMessage
        });
    }
}