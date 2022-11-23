const { SlashCommandBuilder } = require('discord.js');
const w3func = require('../../web3'); // imports web3 functions from web3.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check') // main command for nft checker
        .setDescription('Returns NFT data.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('character') // "/check character" sub command for checking character NFT data
                .setDescription('Get character NFT data.')
                .addStringOption(option =>
                    option.setName('chain')
                        .setDescription('Selected chain of the user')
                        .addChoices( // subcommand's supported chains && param for chain
                            { name: 'bnb', value: 'bnb' },
                            { name: 'oec', value: 'oec' },
                            { name: 'heco', value: 'heco' },
                            { name: 'skale', value: 'skale' },
                        ))
                .addStringOption(option => option.setName('nft').setDescription('ID of the nft.'))) // param for NFT ID
        .addSubcommand((subcommand) =>
            subcommand
                .setName('weapon')
                .setDescription('Get weapon NFT data.')
                .addStringOption(option =>
                    option.setName('chain')
                        .setDescription('Selected chain of the user')
                        .addChoices(
                            { name: 'bnb', value: 'bnb' },
                            { name: 'oec', value: 'oec' },
                            { name: 'heco', value: 'heco' },
                            { name: 'skale', value: 'skale' },
                        ))
                .addStringOption(option => option.setName('nft').setDescription('ID of the nft.')))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('shield')
                .setDescription('Get shield NFT data.')
                .addStringOption(option =>
                    option.setName('chain')
                        .setDescription('Selected chain of the user')
                        .addChoices(
                            { name: 'bnb', value: 'bnb' },
                            { name: 'oec', value: 'oec' },
                            { name: 'heco', value: 'heco' },
                            { name: 'skale', value: 'skale' },
                        ))
                .addStringOption(option => option.setName('nft').setDescription('ID of the nft.'))),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        })
        // console log for slash command author
        author = interaction.user.id;
        console.log(`User ${author} used /check command!`);
        // collected parameters from slash command
        var nftType = interaction.options.getSubcommand();
        var chain = interaction.options.getString('chain');
        var nftID = interaction.options.getString('nft');
        // console log for command data
        console.log(`Command: check ${nftType}  |  Params: { ${chain} , ${nftID} }`);
        //switch case to filter data types
        switch (nftType) {
            case 'character':
                try {
                    container = await w3func.getCBCData(nftID, chain); // fetch CBC data from the blockchain
                    console.log(`Result: ${container}`); // console log for getCBCData function return
                } catch (error) {
                    container = `Something went wrong.. Error in fetching data.`; // catch when there is no NFT under CBC with the matching NFT ID
                    console.log(`Result: Error \n${error}`);
                }

                var newMessage = `${container}`; 
                await interaction.editReply({
                    content: newMessage
                });
                break;
            case 'weapon':
                try {
                    container = await w3func.getCBWData(nftID, chain);
                    console.log(`Result: ${container}`);
                } catch (error) {
                    container = `Something went wrong.. Error in fetching data.`;
                    console.log(`Result: Error \n${error}`);
                }

                var newMessage = `${container}`;
                await interaction.editReply({
                    content: newMessage
                });
                break;
            case 'shield':
                try {
                    container = await w3func.getCBSData(nftID, chain);
                    console.log(`Result: ${container}`);
                } catch (error) {
                    container = `Something went wrong.. Error in fetching data.`;
                    console.log(`Result: Error \n${error}`);
                }

                var newMessage = `${container}`;
                await interaction.editReply({
                    content: newMessage
                });
                break;
            default:
                const newMesage = `Can't find the NFT...`;
                console.log(`Can't find the NFT`);
                await interaction.editReply({
                    content: newMessage
                });
                break;
        }
    }
}