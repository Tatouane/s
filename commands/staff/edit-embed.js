const discord = require('discord.js');
const config = require('../../botconfig/config.json');

module.exports = {
    name: 'edit-embed',
    permissions: ['ADMINISTRATOR'],
    category: 'staff',
    ownerOnly: false,
    description: "Moidifier un embed personnalisé",
    usage: "edit-embed <ID de l'embed> [titre] [description] [couleur]",
    exemples: 'edit-embed 974731330585767996 test Bonjour BLUE',
    run: (client, message) => {
        let args = message.content.split(" ")
        let ID = args[1]

        let title = args[2];
        let description = args[3];
        let color = args[4];

        let title2 = title.replace(/_/g, " ")
        let description2 = description.replace(/_/g, " ")

        message.channel.messages.fetch(ID).then(msg => {
            let oldEmbed = msg.embeds[0];

            let embed = new discord.MessageEmbed(oldEmbed)
            if (title) {
                embed.setTitle(title2)
            }
            if (description2) {
                embed.setTitle(description2)
            }
            if (color) {
                embed.setColor(color)
            }
            msg.edit({ embeds: [embed] })
        })
    },
    options: [
        {
            name: "id",
            description: "ID de l'embed à modifier",
            type: "STRING",
            required: true,
        },
        {
            name: "titre",
            description: "Titre de l'embed",
            type: "STRING",
            required: false,
        },
        {
            name: "description",
            description: "Description de l'embed",
            type: "STRING",
            required: false,
        },
        {
            name: "color",
            description: "Couleur de l'embed",
            type: "STRING",
            required: false,
        },
    ],
    runSlash: (client, interaction) => {
        let title = interaction.options.getString('titre')
        let content = interaction.options.getString('description')
        let color = interaction.options.getString('color')
        let ID = interaction.options.getString('id')

        let msg = interaction.channel.messages.cache.fetch(ID);
        let oldEmbed = msg.embeds[0];

        let embed = new discord.MessageEmbed(oldEmbed)
        if (title) {
            embed.setTitle(title2)
        }
        if (description2) {
            embed.setTitle(description2)
        }
        if (color) {
            embed.setColor(color)
        }
        msg.edit({ embeds: [embed] })
    }
}