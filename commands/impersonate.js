const discord = require("discord.js");
const utils = require("../utils/utils.js");
const fs = require("fs");

//TODO: implement a global temp storage system

module.exports = {
    name: "impersonate",
    data: new discord.SlashCommandBuilder()
        .setName("impersonate")
        .setDescription("Impersonate another user")
        .addSubcommand(subcommand => subcommand
            .setName("start")
            .setDescription("Start impersonating someone")
            .addUserOption(option => option
                .setName("person")
                .setDescription("The person to impersonate")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("stop")
            .setDescription("Stop impersonating someone")
        )
        .addSubcommand(subcommand => subcommand
            .setName("view")
            .setDescription("View current impersonations")
        )
        .toJSON(),
        
    async execute(interaction) {
        const user = interaction.user;
        const guild = interaction.guild;

        const impersonators = require(`${utils.path.temp}/impersonate.json`);

        switch (interaction.options.getSubcommand()) {
            case "start":
                impersonators[user.id] = interaction.options.getUser("person").id;
                fs.writeFileSync(`${utils.path.temp}/impersonate.json`, JSON.stringify(impersonators));
                await interaction.reply({content: impersonators[user.id], ephemeral: true});
                break;

            case "stop":
                delete impersonators[user.id];
                fs.writeFileSync(`${utils.path.temp}/impersonate.json`, JSON.stringify(impersonators));
                await interaction.reply({content: "alright", ephemeral: true});
                break;

            case "view":
                if (Object.keys(impersonators).length > 0) {
                    const text = [];

                    Object.keys(impersonators).forEach(key => {
                        const impersonator = guild.members.cache.get(key).displayName;
                        const target = guild.members.cache.get(impersonators[key]).displayName;
                        text.push(`${impersonator} is impersonating ${target}`);
                    })

                    const embed = new discord.EmbedBuilder()
                        .setColor("#636363")
                        .setTitle("Current impersonations")
                        .setDescription(output.join("\n"))
                        .setTimestamp()
                        .setFooter({ text: "exposed the impersonators", iconURL: interaction.member.user.avatarURL() });
                    
                    await interaction.reply({ embeds: [embed]});
                } else {
                    await interaction.reply("No one is impersonating anyone");
                }

                break;
        }
    }
}