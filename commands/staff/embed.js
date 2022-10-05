const discord = require('discord.js')

module.exports = {
    name: 'embed',
    permissions:['ADMINISTRATOR'],
    category: 'staff',
    ownerOnly: false,
    description: "Envoyer un embed personnalisé",
    usage:'embed <titre> <description> <footer>',
    exemples:'embed Ceci_est_un_titre Ceci_est_une_description Ceci_est_un_footer',
    run:(client, message) =>{
        let args = message.content.split(" ")
        let channel = message.mentions.channels.first()

        let title = args[1];
        let description = args[2];
        let footer = args[3];

        let title2 = title.replace(/_/g, " ")
        let description2 = description.replace(/_/g, " ")
        let footer2 = footer.replace(/_/g, " ")

        if(!channel){
            let embed = new discord.MessageEmbed()
                .setTitle(`${title2}`)
                .setDescription(`${description2}`)
                .setFooter(`${footer2}`)
            message.channel.send({embeds:[embed]})
        }else{
            let embed = new discord.MessageEmbed()
                .setTitle(`${title2}`)
                .setDescription(`${description2}`)
                .setFooter(`${footer2}`)
            message.guild.channels.cache.get(channel.id).send({embeds:[embed]})
            message.reply({content: 'Message envoyé', ephemeral: true})
        }
    },
    options: [
        {
          name: "titre",
          description: "Titre de l'embed",
          type: "STRING",
          required: true,
        },
        {
          name: "description",
          description: "Description de l'embed",
          type: "STRING",
          required: true,
        },
        {
            name: "footer",
            description: "Footer de l'embed",
            type: "STRING",
            required: true,
        },
        {
            name: "color",
            description: "Couleur de l'embed",
            type: "STRING",
            required: false,
        },
    ],
    runSlash:(client, interaction) =>{
        let title = interaction.options.getString('titre')
        let content = interaction.options.getString('description')
        let footer = interaction.options.getString('footer')
        let color = interaction.options.getString('color')

        if(!color){
            let embed = new discord.MessageEmbed()
                .setTitle(`${title}`)
                .setDescription(`${content}`)
                .setFooter({text: `${footer}`})
            interaction.reply({content: 'Message envoyé', ephemeral: true})
            interaction.channel.send({embeds:[embed]})
        }else{
            let embed = new discord.MessageEmbed()
                .setTitle(`${title}`)
                .setDescription(`${content}`)
                .setFooter({text: `${footer}`})
                .setColor(`${color}`)
            interaction.reply({content: 'Message envoyé', ephemeral: true})
            interaction.channel.send({embeds:[embed]})
        }
    }
}