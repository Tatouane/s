const config = require('../../botconfig/config.json')

module.exports = {
    name: 'add-role-everyone',
    permissions: ['MANAGE_ROLES'],
    description: "Ajouter un rôle à un groupe de personnes",
    category: 'modération',
    ownerOnly: false,
    usage: `add-role-everyone <ID du role>`,
    exemples: [`add-role-everyone 953362564182577162`, "add-role everyone-953724538494009364"],
    run: (client, message, guildSettings) => {
        let args = message.content.split(" ")
        let role = args[1];

        if(!role) return message.reply(`Veuillez donner l'id d'un rôle.`)
        else{
            message.guild.members.cache.filter(m => m.bot).forEach(member => {
                member.roles.add(role)
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
            member.roles.add(role.id)
        }).then(members => interaction.reply(`Le role ${role} a été ajouté à ${members.size} personnes.`))
    }
}