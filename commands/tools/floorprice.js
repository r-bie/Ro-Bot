const Sales = require('../../schemas/sales');
const w3func = require('../../web3');
const { SlashCommandBuilder, IntegrationApplication } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('floorprice')
        .setDescription('Returns lowest nft listed.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('character') // "/floorprice" subcommand for characters
                .setDescription('Check lowest character listing.')
                .addStringOption(option =>
                    option.setName('chain')
                        .setDescription('Selected chain of the user')
                        .addChoices( // subcommand's supported chains && param for chain
                            { name: 'bnb', value: 'bnb' },
                            { name: 'oec', value: 'oec' },
                            { name: 'skale', value: 'skale' },
                        ))
                .addStringOption(option => option.setName('limit').setDescription('Limit output data.')))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('weapon') // "/floorprice" subcommand for weapons
                .setDescription('Check lowest weapon listing.')
                .addStringOption(option =>
                    option.setName('chain')
                        .setDescription('Selected chain of the user')
                        .addChoices(
                            { name: 'bnb', value: 'bnb' },
                            { name: 'oec', value: 'oec' },
                            { name: 'skale', value: 'skale' },
                        ))
                .addStringOption(option => option.setName('limit').setDescription('Limit output data.')))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('shield') // "/floorprice" subcommand for shields
                .setDescription('Check lowest shield listing.')
                .addStringOption(option =>
                    option.setName('chain')
                        .setDescription('Selected chain of the user')
                        .addChoices(
                            { name: 'bnb', value: 'bnb' },
                            { name: 'oec', value: 'oec' },
                            { name: 'skale', value: 'skale' },
                        ))
                .addStringOption(option => option.setName('limit').setDescription('Limit output data.'))),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        let newMessage = ""; // bot's reply
        let id = '98699085762031616'; // bot author's id

        // console log for slash command author
        author = interaction.user.id;
        console.log(`User ${author} used /floorprice command!`);

        // collected parameters from slash command
        let nftType = interaction.options.getSubcommand();
        let chain = interaction.options.getString('chain');
        let outputLimit = interaction.options.getString('limit');

        // console log for command data
        console.log(`[logdata]Command /floorprice ${nftType} |  Params: { ${chain} , ${outputLimit} }`);

        // switch case for chain type
        switch (chain) {
            case 'bnb':
                try {
                    result = await Sales.find({ nftType: nftType, blockchain: chain }).sort({ salesPrice: 1 }).limit(outputLimit);
                    resLength = result.length;

                    for (let i = 0; i < resLength; i++) {
                        nftData = await w3func.getCBCData(result[i].nftID, chain);
                        link = `https://bazaar.market/buy/cb-${nftType.toLowerCase()}?id=${result[i].nftID}`;
                        container = `**SKILL ${result[i].salesPrice}**  |  ${nftData}  |  ${link}`
                        newMessage += container + '\n';
                    }
                } catch (error) {
                    newMessage = `Command failed. <@${id}> fix your code.`
                    console.log(`[logdata][logdata]Error in executing /floorprice command. \n${error}`)
                }

                await interaction.editReply({
                    content: newMessage
                });
                break;
            case 'skale':
                try {
                    result = await Sales.find({ nftType: nftType, blockchain: chain }).sort({ salesPrice: 1 }).limit(outputLimit);
                    resLength = result.length;

                    for (let i = 0; i < resLength; i++) {
                        nftData = await w3func.getCBCData(result[i].nftID, chain);
                        link = `https://bazaar.market/buy/cb-${nftType.toLowerCase()}?id=${result[i].nftID}`;
                        container = `**SKILL ${result[i].salesPrice}**  |  ${nftData}  |  ${link}`
                        newMessage += container + '\n';
                    }
                } catch (error) {
                    newMessage = `Command failed. <@${id}> fix your code.`
                    console.log(`[logdata][logdata]Error in executing /floorprice command. \n${error}`)
                }

                await interaction.editReply({
                    content: newMessage
                });
                break;
            case 'oec':
                try {
                    result = await Sales.find({ nftType: nftType, blockchain: chain }).sort({ salesPrice: 1 }).limit(outputLimit);
                    resLength = result.length;

                    for (let i = 0; i < resLength; i++) {
                        nftData = await w3func.getCBCData(result[i].nftID, chain);
                        link = `https://bazaar.market/buy/cb-${nftType.toLowerCase()}?id=${result[i].nftID}`;
                        container = `**SKILL ${result[i].salesPrice}**  |  ${nftData}  |  ${link}`
                        newMessage += container + '\n';
                    }
                } catch (error) {
                    newMessage = `Command failed. <@${id}> fix your code.`
                    console.log(`[logdata][logdata]Error in executing /floorprice command. \n${error}`)
                }

                await interaction.editReply({
                    content: newMessage
                });
                break;
            default:
                newMessage = `Error! Not sure how you got here....`
                console.log('[logdata]Error in executing /floorprice command.')
                break;
        }
    }
}