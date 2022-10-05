const discord = require('discord.js');
const roles = require('../../botconfig/rolesConfig.json')
const db = require('quick.db');
const config = require('../../botconfig/config.json');
const catalogue = require('../../catalogue.json')

module.exports = {
    name: 'pret',
    category: 'vendeurs',
    permissions: ['SEND_MESSAGES'],
    description: "Donne le ping du bot",
    ownerOnly: false,
    usage: 'ping',
    exemples: [`${config.prefix}ping`],
    run: (client, message, args) => {
        if (db.get(`commande_${message.channel.id}.take`) === false) return message.reply(`Cette commande n'a pas encore été prise.`)
        // if (!message.author.roles.has(roles.teamVente)) return;
        // else {
        db.set(`commande_${message.channel.id}.take`, 'finish')
        let embed = new discord.MessageEmbed()
            .setTitle(`<:onlineping:1010224790033932368:> Commande terminée <:onlineping:1010224790033932368:>`)
            .setDescription(`<a:arrow:988462249750458399:> Vous avez fini la commande de ${db.get(`commmande_${message.channel.id}.client`)}.\n<a:arrow:988462249750458399:> Merci de caler un rendez-vous avec lui sur un serveur minage. Le client paye avant la livraison de la commande.\nProposez lui de laisser un avis en vous mentionnant.\n<:arrow:989271818898665522:> En cas de problème avec le bot merci de faire \`${config.prefix}report\` et de ne pas fermer la commande en attendant l'intervention d'un administrateur ou de Tatouane.`)
        message.channel.send({ embeds: [embed] })
        message.channel.messages.fetch(db.get(`commande_${message.channel.id}.embed`)).then(msg => {
            let oldEmbed = msg.embeds[0];
            let embed2 = new discord.MessageEmbed(oldEmbed)
                .setDescription(`**Item:** ${db.get(`commande_${message.channel.id}.item`)}\n**Quantité:** ${db.get(`commande_${message.channel.id}.quantity`)}\n**Prix:** ${db.get(`commande_${message.channel.id}.prix`)}\nPrix total: \`${db.get(`commande_${message.channel.id}.prix`) * db.get(`commandes_${message.channel.id}.quantity`)}\`\n**Pseudo IG**: ${db.get(`commande_${message.channel.id}.pseudo`)}\n**Statut:** Terminée`)
            msg.edit({ embeds: [embed2] })
        })
        // }
    },
    runSlash: (client, interaction) => {
        let member = interaction.guild.members.cache.get(db.get(`commande_${interaction.channel.id}.client`));
        let embed = new discord.MessageEmbed()
            .setTitle(`<:onlineping:1010224790033932368:> Commande prise <:onlineping:1010224790033932368:>`)
            .setDescription(`<a:arrow:988462249750458399:> Vous avez pris la commande de ${member.user.name}.\n<a:arrow:988462249750458399:> Si vous avez besoin d'aide pour farm la commande faites \`${config.prefix}help-me\`\n<:arrow:989271818898665522:> Quand la commande sera prête veuillez faire \`${config.prefix}pret\` pour en informer le client\n<:arrow:989271818898665522:> En cas de problème avec le bot merci de faire \`${config.prefix}report\` et de ne pas fermer la commande en attendant l'intervention d'un administrateur ou de Tatouane.`)
        interaction.channel.send({ embeds: [embed] })
        interaction.channel.messages.fetch(db.get(`commande_${interaction.channel.id}.embed`)).then(msg => {
            let oldEmbed = msg.embeds[0];
            let embed2 = new discord.MessageEmbed(oldEmbed)
                .setDescription(`**Item:** ${catalogue[db.get(`commande_${interaction.channel.id}.item`)].name}\n**Quantité:** ${db.get(`commande_${interaction.channel.id}.quantity`)}${catalogue[item].stack ? 'stack' : 'u'}\n**Prix:** ${db.get(`commande_${interaction.channel.id}.prix`)}\n**Pseudo IG**: ${db.get(`commande_${interaction.channel.id}.pseudoIG`)}\n**Statut:** Préparation en cours`)
            msg.edit({ embeds: [embed2] })
            db.push(`commande_${interaction.channel.id}.vendeurs`, interaction.member.id)
        })
    }
}