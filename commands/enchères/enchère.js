const discord = require("discord.js");
const db = require('quick.db');

module.exports = {
    name: 'enchère',
    permissions: ['ADMINISTRATOR'],
    description: "Envoie le règlement à accepter",
    category: 'enchères',
    ownerOnly: false,
    usage: `enchères`,
    exemples: [`enchères`],
    run: (client, message) => {
        let item = "";
        let prize = "";
        let quantité = "";
        let embed = new discord.MessageEmbed()
            .setDescription(`Que voulez vous faire ?\n\`start\` => Commencer une  enchère\n\`stop\` => Arrêter une enchère \n`)
        message.channel.send({ embeds: [embed] }).then((msg) => {
            message.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(collected => {
                response = collected.first()
                if (response.content.toUpperCase() == 'START') {
                    response.delete();
                    embed.setDescription(`Quel item voulez-vous enchériser ?`);
                    msg.edit({ embeds: [embed] })
                    message.channel.awaitMessages({
                        filter: m => m.author.id === message.author.id,
                        max: 1,
                        time: 30000,
                        errors: ['time']
                    }).then(collected => {
                        item = collected.first().content;
                        collected.first().delete();
                        embed.setDescription(`Quel quantité de cet item voulez-vous mettre en enchère ?`);
                        msg.edit({ embeds: [embed] });
                        message.channel.awaitMessages({
                            filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        }).then(collected => {
                            quantité = collected.first().content;
                            collected.first().delete();
                            embed.setDescription(`À quel prix voulez vous commencer l'enchère ?`);
                            msg.edit({ embeds: [embed] });
                            message.channel.awaitMessages({
                                filter: m => m.author.id === message.author.id,
                                max: 1,
                                time: 30000,
                                errors: ['time']
                            }).then(collected => {
                                prize = collected.first().content;
                                collected.first().delete();
                                embed.setDescription(`Un screen de l'item ? (sinon répondre \`non\`)`);
                                msg.edit({ embeds: [embed] });
                                message.channel.awaitMessages({
                                    filter: m => m.author.id === message.author.id,
                                    max: 1,
                                    time: 30000,
                                    errors: ['time']
                                }).then(m5 => {
                                    if (m5.first().content.toUpperCase() == "NON") {
                                        embed.setTitle(`Enchère`)
                                            .setDescription(`Enchère de ${message.author.tag}`)
                                            .addField(`Item`, `${item}`)
                                            .addField(`Quantité`, `${parseInt(quantité)}`)
                                            .addField(`Prix de départ`, `${parseInt(prize)}$`)
                                            .addField(`Prix actuel`, `${prize}$`)
                                        msg.edit({ embeds: [embed] })
                                        db.set(`enchère_${msg.channel.id}`, { embed: `${msg.id}`, min: parseInt(prize), prix: parseInt(prize), author: message.author });
                                        const collector = message.channel.createMessageCollector(m => !m.author.bot, {time: 99999999999999999999999999999999});
                                        collector.on('collect', m =>{
                                            let prix = parseInt(m.content);
                                            if (prix < db.get(`enchère_${m.channel.id}.prix`)) return m.reply(`Vous ne pouvez pas enchérir plus bas que le prix actuel.`).then(msg => {
                                                msg.delete({ timeout: 5000 });
                                                m.delete({ timeout: 5000 });
                                            });
                                            else {
                                                db.add(`enchère_${m.channel.id}.prix`, prix-db.get(`enchère_${m.channel.id}.prix`));
                                                let ID = db.get(`enchère_${m.channel.id}.embed`);
                                                db.set(`enchère_${m.channel.id}.dernierEnchèrisseur`, `${m.author.id}`);
                                                collector.channel.messages.fetch(ID).then(msg => {
                                                    let embed = new discord.MessageEmbed(msg.embeds[0]);
                                                    embed.fields[3] = { name: `Prix actuel`, value: `${db.get(`enchère_${m.channel.id}.prix`)}$` };
                                                    embed.addField(`Dernier enchèrisseur`, `<@&${m.author.id}>`);
                                                    msg.edit({ embeds: [embed] })
                                                })
                                            }
                                        })
                                        collector.on('end', collected =>{
                                            console.log(`${collected.size} messages collectés.`)
                                        });
                                    }
                                    else {
                                        const attachment = m5.first().attachments.first();
                                        const url = attachment.url;
                                        embed.setTitle(`Enchère`)
                                            .setDescription(`Enchère de ${message.author.tag}`)
                                            .addField(`Item`, `${item}`)
                                            .addField(`Quantité`, `${parseInt(quantité)}`)
                                            .addField(`Prix de départ`, `${parseInt(prize)}$`)
                                            .addField(`Prix actuel`, `${prize}$`)
                                            .addField(`Dernier enchérisseur`, ``)
                                            .setImage(`${url}`)
                                        msg.edit({ embeds: [embed] })
                                        db.set(`enchère_${msg.channel.id}`, { embed: `${msg.id}`, min: parseInt(prize), prix: parseInt(prize), author: `${message.author.id}`, dernierEnchèrisseur: ``, quantity: parseInt(quantité) });
                                        const collector = message.channel.createMessageCollector(m => !m.author.bot, {time: 99999999999999999999999999999999});
                                        collector.on('collect', m =>{
                                            let prix = parseInt(m.content);
                                            if(isNaN(prix)) return;
                                            if (prix < db.get(`enchère_${m.channel.id}.prix`)) return m.reply(`Vous ne pouvez pas enchérir plus bas que le prix actuel.`).then(msg => {
                                                msg.delete({ timeout: 5000 });
                                                m.delete({ timeout: 5000 });
                                            });
                                            else {
                                                db.add(`enchère_${m.channel.id}.prix`, prix-db.get(`enchère_${m.channel.id}.prix`));
                                                let ID = db.get(`enchère_${m.channel.id}.embed`);
                                                db.set(`enchère_${m.channel.id}.dernierEnchèrisseur`, `${m.author.id}`);
                                                collector.channel.messages.fetch(ID).then(msg => {
                                                    let embed = new discord.MessageEmbed(msg.embeds[0]);
                                                    embed.fields[3] = { name: `Prix actuel`, value: `${db.get(`enchère_${m.channel.id}.prix`)}$` };
                                                    embed.fields[4] = {name: `Dernier enchérisseur`, value:m.author};
                                                    msg.edit({ embeds: [embed] })
                                                })
                                            }
                                        })
                                        collector.on('end', collected =>{
                                            console.log(`${collected.size} messages collectés.`)
                                        });
                                    }
                                }).catch(() => {
                                    message.channel.send(`Vous avez mis trop de temps à répondre.`);
                                });
                            }).catch(() => {
                                message.channel.send(`Vous avez mis trop de temps à répondre.`);
                            });
                        }).catch(() => {
                            message.channel.send(`Vous avez mis trop de temps à répondre.`);
                        });
                    }).catch(() => {
                        message.channel.send(`Vous avez mis trop de temps à répondre.`);
                    });
                } else if (response.content.toUpperCase() == 'STOP') {
                    response.delete();
                    embed.setDescription(`Quel est l'ID du message de l'enchère à arrêter ?`);
                    msg.edit({ embeds: [embed] })
                    message.channel.awaitMessages({
                        filter: m => m.author.id === message.author.id,
                        max: 1,
                        time: 30000,
                        errors: ['time']
                    }).then(collected => {
                        ID = collected.first().content;
                        collected.first().delete();
                        message.channel.messages.fetch(ID).then(msg2 => {
                            message.guilds.users.get(db.get(`enchère_${ID}.dernierEnchèrisseur`)).te
                            msg2.embeds[1];
                        })
                        embed.setDescription(`Enchère stoppée.`);
                        msg.edit({ embeds: [embed] });
                    });
                } else {
                    message.channel.send(`Merci d'entrer une valeur correcte`)
                }
            }).catch(() => {
                message.channel.send(`Vous avez mis trop de temps à répondre.`)
            })
        });
    }
};