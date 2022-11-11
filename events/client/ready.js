const ms = require('ms');
const config = require('../../botconfig/config.json')
const db = require('quick.db')

module.exports = {
    name: 'ready',
    once: false,
    execute(client){
        console.log(`Connecté en tant que ${client.user.tag}`);
        client.guilds.cache.get(config.guildID).commands.set(client.commands.map(cmd => cmd)).then((cmd) =>{
            console.log(`${cmd.size} slash commandes chargées.`)
        });

        client.users.cache.forEach(m => {
            if(!db.has(`level_${m.id}`)){
                db.set(`level_${m.id}`, {xp: 0, xptotal: 0, id: m.id, level: 0, name: m.tag})
            }
        });

        // client.guilds.cache.get(config.guildID).channels.cache.get('976843603966054408').send(`<a:check:976859344622723143> **bot connecté** <a:check:976859344622723143>`)

        let state = 0;
        const presences = [
            { type: 'PLAYING', message: 'développé par Tatouane#0830' },
            { type: 'WATCHING', message: 'les modos faire leur travail' },
            { type: 'WATCHING', message: `${config.prefix}help` }
        ];
        setInterval(() => {
            state = (state + 1) % presences.length;
            const presence = presences[state];

            client.user.setActivity(presence.message, { type: presence.type });
        }, 5000);

        setInterval(() =>{
            const counter = require('../../botconfig/channelsConfig.json');
            let membersChannel = counter.members;
        })
    }
}