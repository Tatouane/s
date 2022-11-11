const messageCreate = require("../events/guild/messageCreate");
const index = require('../index');
const db = require('quick.db')
const discord = require('discord.js');
const config = require("../botconfig/config.json");

module.exports = (client) => {
    client.xp = (message) => {
        db.set(`level_${message.author.id}.id`, `${message.author.id}`)
        db.set(`level_${message.author.id}.name`, `${message.author.username}`)
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

        resp.forEach(m => {
            if (m.ID.startsWith('level_')) list.push(m)
        })

        list.sort((a, b) => (a.data < b.data) ? 1 : -1);
        list.reverse();

        const topembed = new discord.MessageEmbed()
            .setTitle('Top de levels')
            // .setDescription(`${list.map(u => `<@${u.data.id}> │Xp: ${u.data.xpTotal}`).join(`\n`)}`)
        for (let index = 0; index < 10; index++) {
            let user = client.users.cache.get(list[index].data.id)
            topembed.addField(`${db.get(`level_${list[index].data.id}.name`)}`, `Xp: ${list[index].data.xptotal}`);
            list.shift();
        }
        return message.channel.send({ embeds: [topembed] })
    }
}