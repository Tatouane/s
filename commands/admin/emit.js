const config = require('../../botconfig/config.json')

module.exports = {
    name: 'emit',
    permissions:['ADMINISTRATOR'],
    description: "Permet d'émettre un évènement pour tester le bot",
    category: 'admin',
    ownerOnly: true,
    usage:`${config.prefix}emit <évènement>`,
    exemples: [`emit GuildMemberAdd`],
    run:(client, message, args) =>{
        let event = args[0]
        client.emit(`${event}`, message.guild.id)
        message.reply(`Event ${event} émit`)
    },
    options: [
        {
            name: "event",
            description: "Évènement à émettre",
            type: "STRING",
            required: true,
        },
    ],
    runSlash:(client, interaction) =>{
        let event = interaction.options.getString('event')
        client.emit(`${event}`, interaction.guild.id)
        interaction.reply(`Event ${event} émit`)
    }
}