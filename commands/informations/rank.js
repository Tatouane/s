const Canvacord = require('canvacord');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'rank',
    category: 'informations',
    permissions: ['SEND_MESSAGES'],
    description: "Envoie votre niveau d'xp",
    ownerOnly: false,
    usage: 'rank [membre]',
    exemples: [`rank @Tatouane`, 'rank'],
    run: (client, message, args) => {
        var user = message.mentions.users.first() || message.author;
        var level = db.get(`level_${user.id}.level`)|| 0;
        var currentxp = db.get(`level_${user.id}.xp`)|| 0;
        var xpNeeded = level * 100 || 100;
        const rankcard = new Canvacord.Rank()
            .setAvatar(user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setCurrentXP(currentxp)
            .setRequiredXP(xpNeeded)
            .setStatus("online")
            .setLevel(level)
            .setRank(1, 'Position', false)
            .setProgressBar("#a81d16", "COLOR")
            .setOverlay("#000000")
            .setUsername(user.username)
            .setDiscriminator(user.discriminator)
            .setBackground("COLOR", "#808080")
        rankcard.build()
            .then(data => {
                const atta = new Discord.MessageAttachment(data, "rank.png")
                message.channel.send({ files:[atta] })
            })
    },
    options: [
        {
            name: "membre",
            description: "Membre dont vous voulez voir l'xp",
            type: "USER",
            required: false,
        },
    ],
    runSlash: (client, interaction) => {
        var user = interaction.options.getUser('membre') || interaction.member;
        var level = db.get(`level_${user.id}`)|| 0;
        var currentxp = db.get(`level_${user.id}`)|| 0;
        var xpNeeded = level * 100 || 100;
        const rankcard = new Canvacord.Rank()
            .setAvatar(user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setCurrentXP(currentxp)
            .setRequiredXP(xpNeeded)
            .setStatus("online")
            .setLevel(db.get(`level_${user.id}.level`)|| 0)
            .setRank(1, 'RANK', false)
            .setProgressBar("#a81d16", "COLOR")
            .setOverlay("#000000")
            .setUsername(user.user.username)
            .setDiscriminator(user.user.discriminator)
            .setBackground("COLOR", "#808080")
        rankcard.build()
            .then(data => {
                const atta = new Discord.MessageAttachment(data, "rank.png")
                interaction.reply({ files:[atta] })
            })
    }
}