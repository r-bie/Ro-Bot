const Guild = require('../../schemas/guild');
const { SlashCommandBuilder, IntegrationApplication } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('database')
        .setDescription('Returns info from database'),
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id })
        if (!guildProfile) {
            guildProfile = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL() ? interaction.guild.iconURL() : "None."
            });

            await guildProfile.save().catch(console.error);
            await interaction.reply({
                content: `Server Name: ${guildProfile.guildName}`
            });
            console.log(`${guildProfile}`);
        } else {
            await interaction.reply({
                content: `Guild ID: ${guildProfile.guildId}`
            });
            console.log(`Guild ID: ${guildProfile.guildId} Already exist.`)
        }
    }
}