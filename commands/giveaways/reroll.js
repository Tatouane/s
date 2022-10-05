const discord = require('discord.js')
const ms = require('ms');

module.exports = {
    name: 'reroll',
    permissions: ['MANAGE_MESSAGES'],
    category: 'giveaways',
    ownerOnly: false,
    description: "Reroll un giveaway",
    usage: 'reroll <ID>',
    exemples: 'reroll 981258349083508796',
    run: (client, message) => {
        let args = message.content.split(" ");
        let ID = args[1];

        client.giveawaysManager.reroll(ID, {
            messages: {
                congrat: ':tada: Nouveau gagnant(s): {winners}! Félicitations, vous avez gagné **{prize}**!\n{messageURL}',
                error: 'Pas de participations valides, je ne peux pas trouver de gagnant(s)!'
            }
        }).catch(e =>{
            if(e.startsWith("No giveaway found with")) return message.reply(`Aucun giveaway trouvé pour l'ID \`${ID}\``)
        });
    },
    options:[
        {
            name:"durée",
            description:"Durée du giveaway",
            required:true,
            type: 'STRING'
        },
        {
            name:"prix",
            description:"Prix du giveaway",
            required:true,
            type:"STRING"
        },
        {
            name:"gagnants",
            description:"Nombre de gagnants (défaut: 1)",
            required:false,
            type:"INTEGER"
        }
    ]
}