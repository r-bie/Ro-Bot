const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const w3func = require('../../web3');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('doxx')
        .setDescription('Get the SKILL balance of the user address.')
        .addStringOption(option => option.setName('owner').setDescription('Metamask Address')),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        var author = interaction.user.id;
        console.log(`[logdata]${author} used doxx command.`);
        
        var address = interaction.options.getString('owner');
        const balance = await w3func.getBalanceOf('bnb', address);
        
        const newMessage = `Balance of ${address} is ${balance}`;
        await interaction.editReply({
            content: newMessage
        });
    }
}