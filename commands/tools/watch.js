const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const w3func = require('../../web3');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('watch')
        .setDescription('Start watching the Rewards Pool.'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        var author = interaction.user.id;
        console.log(`${author} used watch command.`);
        
        const newMessage = `Now watching the Rewards Pool.`;
        w3func.getRewardsPoolBalance('bnb', client);
        await interaction.editReply({
            content: newMessage
        });
    }
}