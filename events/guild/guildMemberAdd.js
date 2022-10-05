const cConfig = require('../../botconfig/channelsConfig.json')
const Discord = require('discord.js')
const canvacord = require('canvacord')
const db = require('quick.db')

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute(client, member) {
        try {
            let clientRole = member.roles.cache.find(role => role.name === "client");
            console.log(`${member.user.username} a rejoint le serveur`);
            let embed = new Discord.MessageEmbed()
                .setTitle(':wave: Nouveau membre :wave:')
                .setDescription(`Bienvenue sur le ${member.guild.name}, ${member} !\nJe t'invite à checker le règlement dans <#${cConfig.rules}> et choisir tes rôles dans <#${cConfig.roles}>.\nUne fois que tu auras accepté le règlement, tu auras accès à tout le serveur.`)
                .setFooter(`${member.guild.name}`)
            client.channels.cache.get(`${cConfig.welcome}`).send({ content: `<@${member.id}>`, embeds: [embed]}).catch(err => console.log(err))
            member.roles.add(`976843602233810998`).catch(err => console.log(err))

        } catch (e) {
            console.log(e)
        }
    }
}