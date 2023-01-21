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
        console.log(`[logdata]User ${author} used /help command!`);

        const newMessage = 
            `***General Commands***\n\n**/help**   - Helps you.. i guess.\n**/invite**   - Pulls up the discord invite link. (Spread the word to your friends)\n**/check**   - Checks NFT data. Supports BNB, SKALE, OEC and HECO.\n**/about**   - What you see is what you get..\n\n\n***OG Commands***\nExecutable in <#1050565113641439233>\n\n**/watch**   - Notifies OG role when Reward Pool's (BNB) balance reaches greater than 100.\n**/doxx**   - Shows the amount of SKILL token from someone's wallet(BNB).\n**/floorprice**   - Shows lowest price for the listed NFT type depending on the filter used (check <#1050565113641439233> pinned messages for more info).`
        await interaction.editReply({
            content: newMessage
        });
    }
}