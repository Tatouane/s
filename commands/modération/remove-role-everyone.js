const config = require('../../botconfig/config.json')

module.exports = {
    name: 'remove-role-everyone',
    permissions: ['MANAGE_ROLES'],
    description: "Retirer un rôle tout les membres",
    category: 'modération',
    ownerOnly: false,
    usage: `remove-role-everyone <ID du role>`,
    exemples: [`remove-role-everyone 953362564182577162`, "remove-role-everyone-953724538494009364"],
    run: (client, message, guildSettings) => {
        let args = message.content.split(" ")
        let role = args[1];

        if(!role) return message.reply(`Veuillez donner l'id d'un rôle.`)
        else{
            message.guild.members.cache.filter(m => m.bot).forEach(member => {
                member.roles.remove(role)
            })
        }
    },
    options: [
        {
            name: "name",
            description: "Rôle à ajouter à tous les membres",
            type: "ROLE",
            required: true,
        },
    ],
    runSlash: (client, interaction) => {
        let role = interaction.options.getRole('role')

        interaction.guild.members.cache.filter(m => !m.bot).forEach(member => {
            member.roles.remove(role.id)
        }).then(members => interaction.reply(`Le role ${role} a été ajouté à ${members.size} personnes.`))
    }
}