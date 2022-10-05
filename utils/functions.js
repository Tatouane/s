const messageCreate = require("../events/guild/messageCreate");
const index = require('../index');
const db = require('quick.db')
const discord = require('discord.js');

module.exports = (client) => {
    client.xp = (message) => {
        db.set(`level_${message.author.id}.id`, `${message.author.id}`)
        db.add(`level_${message.author.id}.xp`, 10)
        db.add(`level_${message.author.id}.xptotal`, 10)
        var level = db.get(`level_${message.author.id}.level`) || 1
        var xp = db.get(`level_${message.author.id}.xp`)
        var xpNeeded = level * 100;
        if (xpNeeded < xp) {
            var newLevel = db.add(`level_${message.author.id}.level`, 1)
            db.subtract(`level_${message.author.id}.xp`, xpNeeded)
            message.channel.send(`Félicitations ${message.author}! Tu passes level ${newLevel}.`)
        }
    };

    client.leaderboard = (message) => {
        const resp = db.all();
        const list = [];

        resp.forEach(m =>{
            if(m.ID.startsWith('level_')) list.push(m)
        })

        list.sort((a, b) => (a.data < b.data) ? 1 : -1);
        list.reverse();

        const topembed = new discord.MessageEmbed()
            .setAuthor('Top de Moons')
            .setDescription(`${list.map(u => `<@${u.data.id}> │Xp: ${u.data.xpTotal}`).join(`\n`)}`)
        return message.channel.send({ embeds: [topembed] })
    }
}