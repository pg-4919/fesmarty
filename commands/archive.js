const discord = require("discord.js");
const utils = require("../utils/utils.js");

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName("archive")
        .setDescription("Stop. Get some help.")
        .toJSON(),
    async respond(interaction) {
        interaction.channel.clone();
        interaction.reply({ content: "please stop", ephemeral: true });
    }
}