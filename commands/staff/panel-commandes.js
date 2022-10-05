const discord = require('discord.js')

module.exports = {
    name: 'panel-commandes',
    category: 'informations',
    permissions: ['SEND_MESSAGES'],
    description: "Envoie votre niveau d'xp",
    ownerOnly: false,
    usage: 'rank [membre]',
    exemples: [`rank @Tatouane`, 'rank'],
    run: (client, message, args) => {
        let button = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('commandes')
                    .setLabel('Commander')
                    .setStyle('PRIMARY')
            )
        message.channel.send({components:[button]})
    },
    options: [],
    runSlash: (client, interaction) => {
    }
}