const config = require('../../botconfig/config.json')

module.exports = {
    name: 'ping',
    category: 'informations',
    permissions:['SEND_MESSAGES'],
    description: "Donne le ping du bot",
    ownerOnly: false,
    usage: 'ping',
    exemples: [`${config.prefix}ping`],
    run:(client, message, args) =>{
        message.reply(':ping_pong: Calcul du ping...').then(msg =>{
            msg.edit(`Le ping du bot est de \`${client.ws.ping}ms\``)
        })
    },
    runSlash:(client, interaction) =>{
        interaction.reply(':ping_pong: Calcul du ping...').then(() =>{
            interaction.editReply(`Le ping du bot est de \`${client.ws.ping}ms\``)
        })
    }
}