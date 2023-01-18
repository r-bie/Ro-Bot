const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Discord invite link.'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        author = interaction.user.id;
        console.log(`[logdata]User ${author} used /invite command!`);

        const newMessage = `Discord invite link: \nhttps://discord.gg/RTKxw3A4Mh`
        await interaction.editReply({
            content: newMessage
        });
    }
}