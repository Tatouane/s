const discord = require('discord.js')
const config = require('../../botconfig/config.json')

module.exports = {
    name: 'poll',
    permissions:['MANAGE_GUILD'],
    category: 'staff',
    description: "Faire un sondage",
    run:(client, message, args) =>{
        let sondage = new discord.MessageEmbed()
            .setTitle(`Sondage`)
            .setDescription(`$`)
    },
    options: [
        {
          name: "titre",
          description: "Titre du sondage",
          type: "STRING",
          required: true,
        },
        {
          name: "contenu",
          description: "Contenu du sondage",
          type: "STRING",
          required: true,
        },
        {
            name: "option1",
            description: "L'option 1 du sondage",
            type: "STRING",
            required: true,
        },
        {
            name: "option2",
            description: "L'option 2 du sondage",
            type: "STRING",
            required: true,
        },
        {
            name: "option3",
            description: "L'option 3 du sondage",
            type: "STRING",
            required: true,
        },
    ],
    runSlash:(client, interaction) =>{
        let title = interaction.options.getString('title')
        let content = interaction.options.getString('content')
        let option1 = interaction.options.getString('option1')
        let option2 = interaction.options.getString('option2')
        let option3 = interaction.options.getString('option3')

        let sondage = new discord.MessageEmbed()
            .setTitle(`${title}`)
            .setDescription(`${content}\n:one: ${option1}\n:two: ${option2}\n:three: ${option3}`)
            .setFooter({text: `Nouveau sondage de ${interaction.member.user.tag}`, iconURL:`${interaction.member.displayAvatarURL()}`})
        interaction.channel.send({embeds:[sondage]}).then(msg =>{
            msg.react('1️⃣')
            msg.react('2️⃣')
            msg.react('3️⃣')
        })
    }
}