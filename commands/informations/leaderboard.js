module.exports = {
    name: 'leaderboard',
    category: 'informations',
    permissions: ['SEND_MESSAGES'],
    description: "Envoie votre niveau d'xp",
    ownerOnly: false,
    usage: 'rank [membre]',
    exemples: [`rank @Tatouane`, 'rank'],
    run: (client, message, args) =>{
        client.leaderboard(message);
    }
}