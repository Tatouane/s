const config = require('../../botconfig/config.json')
const Discord = require('discord.js')

module.exports = {
    name: 'support-embed',
    category: 'staff',
    permissions: ['ADMINISTRATOR'],
    description: "Envoie l'embed de support",
    ownerOnly: false,
    usage: 'support-embed',
    exemples: [`support-embed`],
    run: (client, message, args) => {
        let support = new Discord.MessageEmbed()
            .setTitle('Support')
            .setDescription('Tout ticket troll/spam sera sanctionné.')
            .setFooter({ text: `Support │ ${message.member.guild.name}` })
        const selector = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('support')
                    .setPlaceholder('Choisissez la catégorie de votre ticket')
                    .addOptions([
                        {
                            label: '🎉┃Récompenses giveaways',
                            description: 'Giveways, Invites rewards...',
                            value: 'récompense',
                        },
                        {
                            label: '🤝┃Partenariats',
                            description: 'Pour vous associer à notre market',
                            value: 'partners',
                        },
                        {
                            label: '❓┃Support',
                            description: 'Support général',
                            value: 'support',
                        },
                        {
                            label: '💸┃Poster une Enchère',
                            description: 'Ouvrir une enchère',
                            value: 'enchère',
                        },
                        {
                            label: '🌟┃Grades',
                            description: 'Acheter un grade sur le market',
                            value: 'grade',
                        }
                    ]),
            );
        message.channel.send({ embeds: [support], components: [selector] })
    },
    runSlash: (client, interaction) => {
        let support = new Discord.MessageEmbed()
            .setTitle('Support')
            .setDescription('Tout ticket troll/spam sera sanctionné.')
            .setFooter({ text: `Support │ ${interaction.guild.name}` })
        const selector = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                    .setCustomId('support')
                    .setPlaceholder('Choisissez la catégorie de votre ticket')
                    .addOptions([
                        {
                            label: '🎉┃Récompenses giveaways',
                            description: 'Giveways, Invites rewards...',
                            value: 'récompense',
                        },
                        {
                            label: '🤝┃Partenariats',
                            description: 'Pour vous associer à notre market',
                            value: 'partners',
                        },
                        {
                            label: '❓┃Support',
                            description: 'Support général',
                            value: 'support',
                        },
                        {
                            label: '💸┃Poster une Enchère',
                            description: 'Ouvrir une enchère',
                            value: 'enchère',
                        },
                        {
                            label: '🌟┃Grades',
                            description: 'Acheter un grade sur le market',
                            value: 'grade',
                        }
                    ]),
            );
        interaction.channel.send({ embeds: [support], components: [selector] })
    }
}