const config = require('../../botconfig/config.json')
const roles = require('../../botconfig/rolesConfig.json')
const cConfig = require('../../botconfig/channelsConfig.json')
const discord = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'rules',
    permissions: ['ADMINISTRATOR'],
    description: "Envoie le règlement à accepter",
    category: 'utils',
    ownerOnly: false,
    usage: `rules`,
    exemples: [`rules`],
    run: (client, message, args) => {
        const rulesEmbed = new discord.MessageEmbed()
            .setTitle('📜 Règlement 📜')
            .addFields([
                { name: `I. Avatar Pseudo et Description`, value: `-Pas d'avatars et pseudos concernant le NSFW ou contenant des propos choquants\n-Pas de description incitant à la haine ou contenant des liens token grab` },
                { name: `II. Support et Staff`, value: `-Vous devez respecter le staff et inversement\n-Un staff vous connaissant ne fait pas de favoritisme sur ce serveur\n-Mentionner les <@&${roles.helpeur}>  en cas de question ou ouvrir un ticket support, mais leur envoyer un message privé est interdit\n-Si vous avez rempli une candidature, ouvrez un ticket support et mentionnez la <@&${roles.TeamModo}>\n` },
                { name: `III.Comportement et Discussion`, value: `-Pas d'insultes\n-Pas de débats sur la politique, la religion ou autres sujets pouvant démarrer\n-Pas de ping inutile, ou spam de ping envers le staff ou les autres membres\n-Pas de spam, de Majuscule ou de flood\n-Ne pas spam les GIF\n-Respecter le sujet de chaque salon\n-Pas de menaces\n-Pas de pub mp, ou de pub dans d'autres salon que ceux réservé à cela` },
                { name: `IV. Évent et Giveaways`, value: `-Ne pas cocher la réaction d'un giveaway si la condition n'est pas respectée\n-Les <#${cConfig.prix}>  ne sont pas négociables\n-Ne pas PvP dans les évent ne concernant pas le combat` },
                { name: `V. Sanctions`, value: `-Une pub mp est punie d'un warn\n-Ne pas respecter la condition d'un giveaway est puni d'un warn\n-Les spam ping sont punis d'un mute 12 heures\nLe staff peut changer les sanctions et les choisir en fonction des actes\n4 warns = ban` }
            ])
        message.channel.send({ embeds: [rulesEmbed] }).then(msg => {
            db.set(`rulesMsg_${message.guild.id}`, msg.id)
            msg.react('976859344622723143')
        })
    },
    runSlash: (client, interaction) => {
        const rulesEmbed = new discord.MessageEmbed()
            .setTitle('📜 Règlement 📜')
            .addFields([
                { name: `I. Avatar Pseudo et Description`, value: `-Pas d'avatars et pseudos concernant le NSFW ou contenant des propos choquants\n-Pas de description incitant à la haine ou contenant des liens token grab` },
                { name: `II. Support et Staff`, value: `-Vous devez respecter le staff et inversement\n-Un staff vous connaissant ne fait pas de favoritisme sur ce serveur\n-Mentionner les <@&${roles.helpeur}>  en cas de question ou ouvrir un ticket support, mais leur envoyer un message privé est interdit\n-Si vous avez rempli une candidature, ouvrez un ticket support et mentionnez la <@&${roles.TeamModo}>\n` },
                { name: `III.Comportement et Discussion`, value: `-Pas d'insultes\n-Pas de débats sur la politique, la religion ou autres sujets pouvant démarrer\n-Pas de ping inutile, ou spam de ping envers le staff ou les autres membres\n-Pas de spam, de Majuscule ou de flood\n-Ne pas spam les GIF\n-Respecter le sujet de chaque salon\n-Pas de menaces\n-Pas de pub mp, ou de pub dans d'autres salon que ceux réservé à cela` },
                { name: `IV. Évent et Giveaways`, value: `-Ne pas cocher la réaction d'un giveaway si la condition n'est pas respectée\n-Les <#${cConfig.prix}>  ne sont pas négociables\n-Ne pas PvP dans les évent ne concernant pas le combat` },
                { name: `V. Sanctions`, value: `-Une pub mp est punie d'un warn\n-Ne pas respecter la condition d'un giveaway est puni d'un warn\n-Les spam ping sont punis d'un mute 12 heures\nLe staff peut changer les sanctions et les choisir en fonction des actes\n4 warns = ban` }
            ])
        interaction.channel.send({ embeds: [rulesEmbed] }).then(msg => {
            db.set(`rulesMsg_${interaction.guild.id}`, msg.id)
            msg.react('976859344622723143')
        })
    }
}