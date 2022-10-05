const discord = require('discord.js');
const config = require('../../botconfig/config.json')

module.exports = {
    name: 'report',
    permissions: ['SEND_MESSAGES'],
    description: "Report un bug du bot",
    category: 'informations',
    ownerOnly: false,
    usage: `report <bug> <lien du channel/msg>`,
    exemples: [`report bug_commande_help https://discord.com/channels/951771941625278475/953356749098864741/972488644394909696`],
    run: (client, message) => {
        let args = message.content.split(" ");

        let bug = args[1];
        let link = args[2];

        let bug2 = bug.replace(/_/g, " ")

        if(!bug){
            message.reply(`Veuillez donner un bug`)
        }
        if(!link){
            message.reply(`Veuillez donner un lien`)
        }

        let embed = new discord.MessageEmbed()
            .setTitle(`Bug de ${message.author.username}`)
            .setDescription(`${bug2}`)
            .setURL(`${link}`)

        client.channels.cache.get('972488882992087080').send({ embeds:[embed] })
        message.reply(`Votre bug à été report. Merci de nous aider à améliorer le bot`)
    },
    options:[
        {
            name:'bug',
            type:'STRING',
            description:'Description du bug',
            required: true
        },
        {
            name:'lien',
            type:'STRING',
            description:'Lien du message',
            required: true
        }
    ],
    runSlash: (client, interaction) => {
        let bug = interaction.options.getString('bug');
        let link = interaction.options.getString('lien');

        if(!bug)return interaction.reply(`Veuillez donner un bug`);
        if(!link)return interaction.reply(`Veuillez donner un lien`);

        let embed = new discord.MessageEmbed()
            .setTitle(`Bug de ${interaction.member.username}`)
            .setDescription(`${bug}`)
            .setURL(`${link}`)
        client.channels.cache.get('972488882992087080').send({ embeds:[embed] })
        interaction.reply(`Votre bug à été report. Merci de nous aider à améliorer le bot`)
    }
}