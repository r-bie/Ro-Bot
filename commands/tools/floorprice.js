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
                .addStringOption(option => option.setName('limit').setDescription('Limit output data.'))
                .addStringOption(option => option.setName('level').setDescription(`Character's level.`))
                .addStringOption(option => 
                    option.setName('trait')
                        .setDescription(`Character's trait.`)
                        .addChoices( // trait values into text
                            { name: 'fire', value: '0' },
                            { name: 'earth', value: '1' },
                            { name: 'lightning', value: '2' },
                            { name: 'water', value: '3' },
                        )))
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
                .addStringOption(option => option.setName('limit').setDescription('Limit output data.'))
                .addStringOption(option => option.setName('stars').setDescription(`Weapon's stars.`))
                .addStringOption(option => 
                    option.setName('trait')
                        .setDescription(`Weapon's trait.`)
                        .addChoices( // trait values into text
                            { name: 'fire', value: '0' },
                            { name: 'earth', value: '1' },
                            { name: 'lightning', value: '2' },
                            { name: 'water', value: '3' },
                        )))
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
                .addStringOption(option => option.setName('limit').setDescription('Limit output data.'))
                .addStringOption(option => option.setName('stars').setDescription(`Shield's stars.`))
                .addStringOption(option => 
                    option.setName('trait')
                        .setDescription(`Shield's trait.`)
                        .addChoices( // trait values into text
                            { name: 'fire', value: '0' },
                            { name: 'earth', value: '1' },
                            { name: 'lightning', value: '2' },
                            { name: 'water', value: '3' },
                        ))),
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
        let level = interaction.options.getString('level');
        let stars = interaction.options.getString('stars');
        let trait = interaction.options.getString('trait');

        // console log for command data
        console.log(`[logdata]Command /floorprice ${nftType} |  Params: { ${chain} , ${outputLimit} }`);

        // switch case for chain type
        switch (nftType) {
            case 'character':
                try {
                    result = await Sales.find({
                        blockchain: chain,
                        nftType: "Character", 
                        charLevel: {
                            $gt: Number(level) - 10,
                            $lt: Number(level) + 10
                        },
                        charTrait: trait
                    }).sort({ salesPrice: 1 }).limit(outputLimit);

                    console.log(`[logdata] [\nResult count : ${result.length}\nResult data : \n${result}\n]`);

                    if (result.length < 1) {
                        newMessage = `No records yet.`;
                    } else {
                        for (let i = 0; i < result.length; i++) {
                            nftData = await w3func.getCBCData(result[i].nftID, chain);
                            link = `https://bazaar.market/buy/cb-${nftType.toLowerCase()}?id=${result[i].nftID}`;
                            container = `**${chain.toUpperCase()} SKILL ${result[i].salesPrice}**  |  ${nftData}  |  ${link}`
                            newMessage += container + '\n';
                        }
                    }
                } catch (error) {
                    newMessage = `Command failed.`;
                }
                console.log(`[logdata]${newMessage}`);
                await interaction.editReply({
                    content: newMessage
                });
                break;
            case 'weapon':
                try {
                    result = await Sales.find({
                        blockchain: chain,
                        nftType: "Weapon",
                        weapStars: stars,
                        weapTrait: trait
                     }).sort({ salesPrice: 1 }).limit(outputLimit);

                    console.log(`[logdata] [\nResult count : ${result.length}\nResult data : \n${result}\n]`);

                    if (result.length < 1) {
                        newMessage = `No records yet.`;
                    } else {
                        for (let i = 0; i < result.length; i++) {
                            nftData = await w3func.getCBWData(result[i].nftID, chain);
                            link = `https://bazaar.market/buy/cb-${nftType.toLowerCase()}?id=${result[i].nftID}`;
                            container = `**${chain.toUpperCase()} SKILL ${result[i].salesPrice}**  |  ${nftData}  |  ${link}`
                            newMessage += container + '\n';
                        }
                    }
                } catch (error) {
                    newMessage = `Command failed.`;
                }
                console.log(`[logdata]${newMessage}`);
                await interaction.editReply({
                    content: newMessage
                });
                break;
            case 'shield':
                try {
                    result = await Sales.find({ 
                        blockchain: chain,
                        nftType: "Shield",
                        weapStars: stars,
                        weapTrait: trait
                    }).sort({ salesPrice: 1 }).limit(outputLimit);

                    console.log(`[logdata] [\nResult count : ${result.length}\nResult data : \n${result}\n]`);

                    if (result.length < 1) {
                        newMessage = `No records yet.`;
                    } else {
                        for (let i = 0; i < result.length; i++) {
                            nftData = await w3func.getCBSData(result[i].nftID, chain);
                            link = `https://bazaar.market/buy/cb-${nftType.toLowerCase()}?id=${result[i].nftID}`;
                            container = `**${chain.toUpperCase()} SKILL ${result[i].salesPrice}**  |  ${nftData}  |  ${link}`
                            newMessage += container + '\n';
                        }
                    }
                } catch (error) {
                    newMessage = `Command failed.`;
                }
                console.log(`[logdata]${newMessage}`);
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