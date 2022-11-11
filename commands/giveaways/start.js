const discord = require('discord.js');
const ms = require('ms');
const giveaways = require('../../giveaways.json');
const fs = require('fs');
const db = require('quick.db');

module.exports = {
    name: 'start',
    permissions: ['ADMINISTRATOR'],
    category: 'giveaways',
    ownerOnly: false,
    description: "Créer un giveaway",
    usage: 'start',
    exemples: 'start',
    run: (client, message) => {
        let prize = "";
        let gagnants = 0;
        let roleId = "";
        let embed = new discord.MessageEmbed()
            .setDescription(`Que voulez vous faire gagner ?`)
        message.channel.send({ embeds: [embed] }).then((msg) => {
            message.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(collected => {
                prize = collected.first().content;
                collected.first().delete();
                embed.setDescription('Voulez-vous mettre une condition ?');
                msg.edit({ embeds: [embed] })
                message.channel.awaitMessages({
                    filter: m => m.author.id === message.author.id,
                    max: 1,
                    time: 30000,
                    errors: ['time']
                }).then(collected => {
                    response = collected.first()
                    if (response.content.toUpperCase() == "OUI") {
                        collected.first().delete();
                        embed.setDescription('Quel type de condition ? (invites ou role)');
                        msg.edit({ embeds: [embed] });
                        message.channel.awaitMessages({
                            filter: m => m.author.id === message.author.id,
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        }).then(collected => {
                            response = collected.first()
                            if (response.content.toUpperCase() == "INVITES") {
                                collected.first().delete();
                                embed.setDescription("Combien d'invites faut-il pour participer au giveaway ?");
                                msg.edit({ embeds: [embed] })
                                message.channel.awaitMessages({
                                    filter: m => m.author.id === message.author.id,
                                    max: 1,
                                    time: 30000,
                                    errors: ['time']
                                }).then(collected => {
                                    let nombre = parseInt(collected.first().content);
                                    collected.first().delete();
                                    embed.setDescription(`Combien de gagnants voulez-vous ?`);
                                    msg.edit({ embeds: [embed] });
                                    message.channel.awaitMessages({
                                        filter: m => m.author.id == message.author.id,
                                        max: 1,
                                        time: 30000,
                                        errors: ['time']
                                    }).then(collected => {
                                        gagnants = parseInt(collected.first().content);
                                        collected.first().delete();
                                        embed.setDescription(`Combien de temps le giveaway doit durer ?`)
                                        msg.edit({ embeds: [embed] });
                                        message.channel.awaitMessages({
                                            filter: m => m.author.id == message.author.id,
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        }).then(collected => {
                                            let time = collected.first().content
                                            msg.delete();
                                            client.giveawaysManager.start(message.channel, {
                                                duration: ms(time),
                                                winnerCount: gagnants,
                                                prize,
                                                exemptMembers: (member, giveaway) => db.get(`invites_${member.id}.joined`) < nombre,
                                                messages: {
                                                    condition: `Avoir ${nombre} invitations`,
                                                    giveaway: '🎉🎉 **GIVEAWAY** 🎉🎉',
                                                    giveawayEnded: '🎉🎉 **GIVEAWAY TERMINÉ** 🎉🎉',
                                                    drawing: 'Fin {timestamp}',
                                                    inviteToParticipate: 'Cliquez sur 🎉 pour participer!',
                                                    winMessage: 'Félicitations, {winners}! Vous avez gagné [{this.prize}]({this.messageURL}) !',
                                                    embedFooter: '{this.winnerCount} gagnant(s)',
                                                    noWinner: 'Giveaway annulé, pas assez de participations valides.',
                                                    hostedBy: 'Fourni par: {this.hostedBy}',
                                                    winners: 'Gagnant(s):',
                                                    endedAt: 'Fini '
                                                }
                                            }).catch(err => {
                                                console.log(err)
                                                message.channel.send(`Il y a eu une erreur: \`${err}\``)
                                            })
                                            collected.first().delete();
                                        })
                                    })
                                })
                            }
                            else if(response.content.toUpperCase() == "ROLE"){
                                collected.first().delete();
                                embed.setDescription(`Veuillez donner l'id du rôle nécéssaire.`)
                                msg.edit({embeds:[embed]})
                                message.channel.awaitMessages({
                                    filter: m => m.author.id === message.author.id,
                                    max: 1, time: 30000,
                                    errors: ['time']
                                }).then(collected => {
                                    roleId = collected.first().content;
                                    collected.first().delete();
                                    embed.setDescription(`Combien de gagnants voulez-vous ?`);
                                    msg.edit({ embeds: [embed] });
                                    message.channel.awaitMessages({
                                        filter: m => m.author.id == message.author.id,
                                        max: 1,
                                        time: 30000,
                                        errors: ['time']
                                    }).then(collected => {
                                        gagnants = parseInt(collected.first().content);
                                        collected.first().delete();
                                        embed.setDescription(`Combien de temps le giveaway doit durer ?`)
                                        msg.edit({ embeds: [embed] });
                                        message.channel.awaitMessages({
                                            filter: m => m.author.id == message.author.id,
                                            max: 1,
                                            time: 30000,
                                            errors: ['time']
                                        }).then(collected => {
                                            let time = collected.first().content
                                            msg.delete();
                                            client.giveawaysManager.start(message.channel, {
                                                duration: ms(time),
                                                winnerCount: gagnants,
                                                prize,
                                                condition: `Avoir le rôle <@&${roleId}>`,
                                                exemptMembers: (member, giveaway) => !member.roles.has(roleId),
                                                messages: {
                                                    giveaway: '🎉 **GIVEAWAY** 🎉',
                                                    giveawayEnded: '🎉 **GIVEAWAY TERMINÉ** 🎉',
                                                    drawing: 'Fin {timestamp}',
                                                    inviteToParticipate: 'Cliquez sur 🎉 pour participer!',
                                                    winMessage: 'Félicitations, {winners}! Vous avez gagné {this.prize} !',
                                                    embedFooter: '{this.winnerCount} gagnant(s)',
                                                    noWinner: 'Giveaway annulé, pas assez de participations valides.',
                                                    hostedBy: 'Fourni par: {this.hostedBy}',
                                                    winners: 'Gagnant(s):',
                                                    endedAt: 'Fin le'
                                                }
                                            }).catch(err => {
                                                console.log(err)
                                                message.channel.send(`Il y a eu une erreur: \`${err}\``)
                                            })
                                            collected.first().delete();
                                        })
                                    })
                                })
                            }
                        })
                    }
                })
            })
        });
    },
    options: [
        {
            name: "durée",
            description: "Durée du giveaway",
            required: true,
            type: 'STRING'
        },
        {
            name: "prix",
            description: "Prix du giveaway",
            required: true,
            type: "STRING"
        },
        {
            name: "condition",
            description: "Le type de condition",
            required: true,
            type: 3,
            choices: [
                {
                    name: "Invites",
                    value: "inv"
                },
                {
                    name: "Role",
                    value: "role"
                }
            ]
        },
        {
            name: "gagnants",
            description: "Nombre de gagnants (défaut: 1)",
            required: false,
            type: "INTEGER"
        },

    ],
    runSlash: (client, interaction) => {
        const time = interaction.options.getString('durée');
        const gagnants = interaction.options.getInteger('gagnants') || 1;
        const prix = interaction.options.getString('prix');
        const cond = interaction.options.getBoolean('condition');
        const minInv = interaction.options.getInteger('invites');

        try {
            let embed = new discord.MessageEmbed()
                .setTitle(prix)
                .setDescription(`Condition: ${cond ? `${minInv}invites` : 'Pas de condition'}`)
            interaction.channel.send()
        } catch (e) {
            console.warn(e);
            interaction.reply(`Il y a eu une erreur: \`${e}\``);
        }
    }
}