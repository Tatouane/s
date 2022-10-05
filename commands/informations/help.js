const discord = require('discord.js')
const { readdirSync } = require('fs')
const commandsFolder = readdirSync('./commands')
const config = require('../../botconfig/config.json')
const prefix = config.prefix

module.exports = {
    name: 'help',
    permissions: ['SEND_MESSAGES'],
    category: 'informations',
    description: "Donne la liste des commandes du bot",
    ownerOnly: true,
    usage: `help <commande>`,
    exemples: [`help ping`, `help`],
    run: (client, message, args) => {
        if (!args[0]) {
            let noArgsEmbed = new discord.MessageEmbed()
                .setColor('#54ea7')
            for (const category of commandsFolder) {
                noArgsEmbed.addField(
                    `${category.charAt(0).toUpperCase() + category.slice(1)}`,
                    `${client.commands.filter(cmd => cmd.category == category.toLowerCase()).map(cmd => `\`${prefix + cmd.name}\` \n${cmd.description}`).join(`\n`)}`
                )

            }

            message.channel.send({ embeds: [noArgsEmbed] })
        }
        // else if(args[0] === commandsFolder.ca){
        //     let embedCategory = new discord.MessageEmbed()
        //         .setTitle(`Help ${this.category}`)
        // }
        else {
            const cmd = client.commands.get(args[0]);
            if (!cmd) return message.reply(`La commande ${args[0]} n'existe pas`)

            let ArgsEmbed = new discord.MessageEmbed()
                .setTitle(`Help: ${cmd.name}`)
                .setDescription(`Commande: \`${prefix}${cmd.name}\`\nBot-admin uniquement: ${cmd.ownerOnly ? 'Oui' : 'Non'}\nDescription: **${cmd.description}**\nUtilisation: \`${prefix}${cmd.usage}\`\nPermissions requises: ${cmd.permissions.join(',')}\nExemples: \`${prefix}${cmd.exemples}\``)
                .setColor('#54ea7')
            message.channel.send({ embeds: [ArgsEmbed] })
        }
    },
    options: [
        {
            name: "commande",
            description: "Aide détaillée sur une commandes",
            type: "STRING",
            required: false,
        },
    ],
    runSlash: (client, interaction, guildSettings) => {
        let command = interaction.options.getString('commande')

        if (!command) {
            let noArgsEmbed = new discord.MessageEmbed()
                .setColor('#54ea7')
            for (const category of commandsFolder) {
                noArgsEmbed.addField(
                    `${category.charAt(0).toUpperCase() + category.slice(1)}`,
                    `${client.commands.filter(cmd => cmd.category == category.toLowerCase()).map(cmd => `\`${prefix + cmd.name}\` \n${cmd.description}`).join(`\n`)}`
                )
            }

            interaction.reply({ embeds: [noArgsEmbed] })
        }
        // else if(args[0] === commandsFolder.ca){
        //     let embedCategory = new discord.MessageEmbed()
        //         .setTitle(`Help ${this.category}`)
        // }
        else {
            const cmd = client.commands.get(args[0]);
            if (!cmd) return interaction.reply(`La commande ${command} n'existe pas`)

            let ArgsEmbed = new discord.MessageEmbed()
                .setTitle(`Help: ${cmd.name}`)
                .setDescription(`Commande: \`${prefix}${cmd.name}\`\nBot-admin uniquement: ${cmd.ownerOnly ? 'Oui' : 'Non'}\nDescription: **${cmd.description}**\nUtilisation: \`${guildSettings.prefix}${cmd.usage}\`\nPermissions requises: ${cmd.permissions.join(',')}\nExemples: \`${guildSettings.prefix}${cmd.exemples}\``)
                .setColor('#54ea7')
            interaction.reply({ embeds: [ArgsEmbed] })
        }
    }
}