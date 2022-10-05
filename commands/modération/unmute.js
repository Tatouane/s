const config = require('../../botconfig/config.json')
const channel = require('../../botconfig/channelsConfig.json')
const ms = require('ms')
const Discord = require('discord.js')

module.exports = {
    name: 'unmute',
    permissions: ['MUTE_MEMBERS'],
    description: "Unmute une personne",
    category: 'modération',
    ownerOnly: false,
    usage: `unmute <personne>`,
    exemples: [`unmute @Tatouane`],
    run: (client, message) => {
        let mention = message.mentions.members.first();

        if (mention == undefined) {
            message.reply(`Veuillez mentionner un membre`)
        }
        else if(mention.timeout){
            message.reply(`Ce membre n'est pas mute`)
        }
        else{
            mention.timeout(null).catch(e =>{
                message.reply(`Il y a eu une erreur: ${e}`)
                console.warn(e)
            })
            let embed = new Discord.MessageEmbed()
                .setTitle('Mute')
                .addFields(
                    { name: 'Membre unmute', value: `<@${mention.user.id}>`, inline: true },
                    { name: 'Modérateur', value: `${message.author}`, inline: true },
                    { name: 'ID du membre mute', value: `${mention.user.id}`, inline: true }
                )
            message.channel.send({ embeds: [embed] })
            message.guild.channels.cache.get(`${channel.logs}`).send({ embeds: [embed] }).catch(err => console.log(err))
        }
    },

    options:[
        {
            name:'personne',
            description:'Personne à unmute',
            type:'USER'
        }
    ],
    runSlash: (client, interaction) => {
        let mention = interaction.options.getUser('personne');

        if (mention == undefined) {
            interaction.reply(`Veuillez mentionner un membre`)
        }
        else{
            mention.timeout(null).catch(e =>{
                interaction.reply(`Il y a eu une erreur: ${e}`)
                console.warn(e)
            })
            let embed = new Discord.MessageEmbed()
                .setTitle('Mute')
                .addFields(
                    { name: 'Membre unmute', value: `<@${mention.user.id}>`, inline: true },
                    { name: 'Modérateur', value: `${message.author}`, inline: true },
                    { name: 'ID du membre mute', value: `${mention.user.id}`, inline: true }
                )
            interaction.channel.send({ embeds: [embed] })
            client.channels.cache.get(`${channel.logs}`).send({ embeds: [embed] }).catch(err => console.log(err))
        }
    }
}