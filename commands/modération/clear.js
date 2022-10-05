const config = require('../../botconfig/config.json')

module.exports = {
    name: 'clear',
    permissions: ['MANAGE_MESSAGES'],
    description: "Supprimer des messages dans un salon",
    category: 'modération',
    ownerOnly: false,
    usage: `clear <nombre de messages>`,
    exemples: [`clear 10`],
    run: (client, message) => {
        let args = message.content.split(" ");

        if (args[1] == undefined) {
            message.reply(`Nombre de messages mal ou non défini.`);
        }
        else {
            let number = parseInt(args[1]);

            if (isNaN(number)) {
                message.reply(`Nombre de messages mal ou non défini.`);
            }
            else {
                message.channel.bulkDelete(number).then(messages => {
                    console.log(`Suppression de ${messages.size} messages dans ${message.channel.name}.`)
                    let msg = message.channel.send(`${messages.size} messages supprimé(s)`)
                }).catch(err => {
                    console.log(`erreur lors de la supression des messages: ${err}`)
                    message.channel.send(`Il y a eu une erreur : \`${err}\``)
                })
            }
        }
    },
    options:[
        {
            name:'nombre',
            type:'INTEGER',
            description:'Nombre de messages à supprimer',
            required: true
        }
    ],
    runSlash: (client, interaction) => {
        let amount = interaction.options.getInteger('nombre')

        if(amount == undefined){
            interaction.reply(`Nombre de messages mal ou non défini.`);
        }
        else{
            if(isNaN(amount)){
                interaction.reply(`Nombre de messages mal ou non défini.`);
            }
            else{
                interaction.channel.bulkDelete(amount).then(messages =>{
                    console.log(`Suppression de ${messages.size} messages dans ${interaction.channel.name}.`)
                    let msg = message.channel.send(`${messages.size} messages supprimé(s)`)  
                }).catch(err =>{
                    console.log(`erreur lors de la supression des messages: ${err}`)
                    interaction.channel.send(`Il y a eu une erreur : \`${err}\``)
                })
            }
        }
    }
}