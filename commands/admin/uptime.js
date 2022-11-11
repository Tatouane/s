const config = require('../../botconfig/config.json')

module.exports = {
    name: 'uptime',
    permissions:['ADMINISTRATOR'],
    description: "Renvoie depuis combien de temps le bot est en ligne",
    category: 'utils',
    ownerOnly: true,
    usage:`uptime`,
    exemples: [`uptime`],
    run: (client, message, args) => {
        // console.log(client.guilds.cache.get('1015369480920109067').roles.everyone.id)
        const ToTalSeconds = (client.uptime / 1000);
        const Days = Math.floor(ToTalSeconds / 86400);
        const Hours = Math.floor(ToTalSeconds / 3600);
        const Minutes = Math.floor(ToTalSeconds / 60);
        const Seconds = Math.floor(ToTalSeconds % 60);
        if(Minutes === 0){
            message.channel.send(`Je suis en ligne depuis ${Seconds}secondes`)
        }
        else if(Hours === 0){
            message.channel.send(`Je suis en ligne depuis ${Minutes}minutes et ${Seconds}secondes`)
        }
        else if(Days === 0){
            message.channel.send(`Je suis en ligne depuis ${Hours}heures ${Minutes}minutes et ${Seconds}secondes`)
        }
        else{
            message.channel.send(`Je suis en ligne depuis ${Days}jours ${Hours}heures ${Minutes}minutes et ${Seconds}secondes`)
        }
    },
    runSlash: (client, interaction) => {
        const ToTalSeconds = (client.uptime / 1000);
        const Days = Math.floor(ToTalSeconds / 86400);
        const Hours = Math.floor(ToTalSeconds / 3600);
        const Minutes = Math.floor(ToTalSeconds / 60);
        const Seconds = Math.floor(ToTalSeconds % 60);
        if(Minutes === 0){
            interaction.reply(`Je suis en ligne depuis ${Seconds}secondes`)
        }
        else if(Hours === 0){
            interaction.reply(`Je suis en ligne depuis ${Minutes}minutes et ${Seconds}secondes`)
        }
        else if(Days === 0){
            interaction.reply(`Je suis en ligne depuis ${Hours}heures ${Minutes}minutes et ${Seconds}secondes`)
        }
        else{
            interaction.reply(`Je suis en ligne depuis ${Days}jours ${Hours}heures ${Minutes}minutes et ${Seconds}secondes`)
        }
    }
}