// const cConfig = require('../../botconfig/channelsConfig.json')
// const Discord = require('discord.js')
// const canvacord = require('canvacord')
// const db = require('quick.db')
// const roles = require('../../botconfig/rolesConfig.json')

// module.exports = {
//     name: 'messageReactionAdd',
//     once: false,
//     execute(client, reaction, user) {
//         let ID = db.get(`rulesMsg_${reaction.guild.id}`)
//         if(!reaction.message.id === '976880590131437608')return;
//         else{
//             if(reaction.emoji.id === '976859344622723143'){
//                 reaction.user.roles.remove(roles.unverified)
//                 reaction.user.roles.add(roles.client)
//             }
//         }
//     }
// }