const channel = require('../../botconfig/channelsConfig.json')
const ms = require('ms')
const Discord = require('discord.js')

module.exports = {
    name: 'kick',
    permissions: ['MUTE_MEMBERS'],
    description: "Kick une personne",
    category: 'modération',
    ownerOnly: false,
    usage: `kick <personne> <raison>`,
    exemples: [`kick @Tatouane Insultes`],
    run: (client, message, guildSettings) => {
        let mention = message.mentions.members.first();
        let args = message.content.split(" ");
        let reason = args.slice(2).join(" ");

        if (mention == undefined) {
            message.reply(`Veuillez mentionner un membre`)
        }
        else if (!reason) {
            message.reply(`Veuillez donner une raison`)
        }
        else if(!mention.kickable){
            message.reply(`Vous ne pouvez pas kick **${mention.user.name}**`)
        }
        else{
            let logs = message.guild.channels.cache.find(c => c.name.includes('logs'))
            mention.kick(reason).catch(e =>{
                message.reply(`Il y a eu une erreur: ${e}`)
                console.warn(e)
            })
            let embed = new Discord.MessageEmbed()
                .setTitle('Kick')
                .addFields(
                    { name: 'Membre kick', value: `<@${mention.user.id}>`, inline: true },
                    { name: 'Modérateur', value: `${message.author}`, inline: true },
                    { name: 'Raison', value: `${reason}`, inline: true },
                    { name: 'ID du membre kick', value: `${mention.user.id}`, inline: true }
                )
            message.channel.send({ embeds: [embed] })
            client.channels.cache.get(`${logs}`).send({ embeds: [embed] }).catch(err => console.log(err))
        }
    },
    options:[
        {
            name:'membre',
            description:'Personne à kick',
            type:'USER',
            required: true
        },
        {
            name:'raison',
            description:'Raison du kick',
            type:'STRING',
            required: true
        }
    ],
    runSlash: (client, interaction) => {
        let mention = interaction.options.getUser('membre')
        let reason = interaction.options.getString('raison')
        if (mention == undefined) {
            interaction.reply(`Veuillez mentionner un membre`)
        }
        else if (!reason) {
            interaction.reply(`Veuillez donner une raison`)
        }
        else if (mention.kickable) {
            mention.kick(reason).catch(e =>{
                interaction.reply(`Il y a eu une erreur: ${e}`)
                console.warn(e)
            })
            let embed = new Discord.MessageEmbed()
                .setTitle('Kick')
                .addFields(
                    { name: 'Membre kick', value: `<@${mention.user.id}>`, inline: true },
                    { name: 'Modérateur', value: `${interaction.author}`, inline: true },
                    { name: 'Raison', value: `${reason}`, inline: true },
                    { name: 'ID du membre kick', value: `${mention.user.id}`, inline: true }
                )
            interaction.channel.send({ embeds: [embed] })
            client.channels.cache.get(`${guildSettings.logsChannel}`).send({ embeds: [embed] }).catch(err => console.log(err))
        }
    }
}