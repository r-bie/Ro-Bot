const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const w3func = require('../../web3');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('watch')
        .setDescription('Start watching the Rewards Pool.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('skill')
                .setDescription('Watch RP for SKILL.'))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('valor')
                .setDescription('Watch RP for VALOR.')),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        var author = interaction.user.id;
        console.log(`[logdata]${author} used watch command.`);

        let subCommand = interaction.options.getSubcommand();
        let newMessage = '';

        await interaction.editReply({
            content: `Now watching ${subCommand} RP...`
        })

        switch (subCommand) {
            case 'skill':
                console.log(`[logdata]Now watching SKILL RP...`);
                rpBalance = await w3func.getRewardsPoolBalance('bnb', 'skill', client);
                newMessage = `<@&${w3func.ogRoleId}> Reward Pool's balance for SKILL is ${rpBalance}`;
                console.log(`[logdata]Reward Pool's balance for SKILL is ${rpBalance}`);

                try {
                    await interaction.followUp({
                        content: newMessage
                    });
                } catch (error) {
                    console.error();
                }
                break;
            case 'valor':
                console.log(`[logdata]Now watching VALOR RP...`);
                rpBalance = await w3func.getRewardsPoolBalance('bnb', 'valor', client);
                newMessage = `<@&${w3func.ogRoleId}> Reward Pool's balance for VALOR is ${rpBalance}`;
                console.log(`[logdata]Reward Pool's balance for VALOR is ${rpBalance}`);

                try {
                    await interaction.followUp({
                        content: newMessage
                    });
                } catch (error) {
                    console.error();
                }
                break;
            default:
                newMessage = 'Error! How did you get here...'
                break;
        }
    }
}