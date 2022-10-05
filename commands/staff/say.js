const discord = require('discord.js')

module.exports = {
    name: 'say',
    permissions:['ADMINISTRATOR'],
    description: "Envoyer un message sous l'identité du bot",
    category: 'staff',
    ownerOnly: false,
    usage: `say [channel] <message>`,
    exemples: [`say #general bonjour`],
    run:(client, message) =>{
        let channel = message.mentions.channels.first()

        if(!channel){
            message.channel.send(`${message.content}`)
            message.reply({content: 'Message envoyé', ephemeral: true})
        }else{
            message.guild.channels.cache.get(channel.id).send(`${args.slice(2)}`)
            message.reply({content: 'Message envoyé', ephemeral: true})
        }
    },
    options: [
        {
          name: "message",
          description: "Contenu du message",
          type: "STRING",
          required: true,
        },
        {
            name: "salon",
            description: "Salon ou envoyer le message",
            type: "CHANNEL",
            required: false,
          },
    ],
    runSlash:(client, interaction) =>{
        let content = interaction.options.getString('message')
        let channel = interaction.options.getChannel('salon')
        
        if(!channel){
            interaction.channel.send(`${content}`)
            interaction.reply({content: 'Message envoyé', ephemeral: true})
        }else{
            interaction.guild.channels.cache.get(channel.id).send(`${content}`)
            interaction.reply({content: 'Message envoyé', ephemeral: true})
        }
    }
}