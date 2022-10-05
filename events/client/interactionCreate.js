const config = require('../../botconfig/config.json');
const messageCreate = require('../guild/messageCreate');
const discord = require('discord.js');
const catalogue = require('../../catalogue.json');
const Discord = require('discord.js');
const cConfig = require('../../botconfig/channelsConfig.json');
const roles = require('../../botconfig/rolesConfig.json');
const db = require('quick.db');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const cmd = client.commands.get(interaction.commandName)
            if (!cmd) return interaction.reply("Cette commande n'existe pas")
            else {
                if (!interaction.member.permissions.has([cmd.permissions])) {
                    interaction.reply(`Vous n'avez pas les permissions \`${cmd.permissions}\``)
                }
                else {
                    try {
                        cmd.runSlash(client, interaction)
                        interaction.channel.bulkDelete(1)
                    } catch (e) {
                        console.log(e)
                        interaction.reply(`Il y a eu une erreur: \`${e}\``)
                    }
                }
            }
        }
        else if (interaction.isButton() && interaction.customID === 'commandes') {
            client.guilds.cache.get(config.guildID).channels.create(`♻️│${interaction.member.name}`, {
                type: 'text',
                parent: '1012072168407977996',
                permissionOverwrites: [{
                    id: interaction.member.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    deny: ['MANAGE_CHANNELS']
                },
                {
                    id: roles.TeamVente,
                    allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
                    deny: []
                },
                ],
            }).then(ticket => {
                interaction.reply({ content: `Votre ticket de commande a été ouvert dans <#${ticket.id}>`, ephemeral: true })

                let item = "";
                let quantité = 0;
                let pseudo = "";

                let embed = new discord.MessageEmbed()
                    .setDescription(`Que voulez-vous commander ?`)
                ticket.send({ content: `${interaction.member}<@&${roles.TeamVente}>`, embeds: [embed] }).then(msg => {
                    msg.channel.awaitMessages({
                        filter: m => m.author.id === interaction.member.id,
                        max: 1,
                        time: 30000,
                        errors: ['time']
                    }).then(collected => {
                        item = collected.first().content;
                        collected.first().delete();
                        embed.setDescription(`Quel quantité de cet item voulez-vous acheter ?`);
                        msg.edit({ embeds: [embed] });
                        msg.channel.awaitMessages({
                            filter: m => m.author.id === interaction.member.id,
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        }).then(collected => {
                            quantité = parseInt(collected.first().content);
                            collected.first().delete();
                            embed.setDescription(`Quel votre pseudo in game ?`);
                            msg.edit({embeds:[embed]});
                            msg.channel.awaitMessages({
                                filter: m => m.author.id === interaction.member.id,
                                max: 1,
                                time: 30000,
                                errors: ['time']
                            }).then(collected => {
                                pseudo = collected.first().content;
                                let prize = quantité * catalogue[item].prize;
                                collected.first().delete();
                                embed.setTitle(`Commande de ${interaction.member.name}`);
                            embed.setDescription(`**Item:** ${catalogue[item].name}\n**Quantité:** ${quantité}${catalogue[item].stack ? 'stack' : ''}\n**Prix:** ${prize}\n**Pseudo IG**: ${pseudo}\n**Statut:** En attente`);
                            msg.edit({embeds:[embed]});
                            db.set(`commande_${msg.channel.id}`, { item: `${item}`, prix: prize, quantity: quantité, pseudoIG: pseudo, vendeurs: [], categorie: catalogue[item].category, client: `${interaction.member.id}`, statut: `waiting`, embed: `${msg.id}`})
                            });
                        });
                    });
                });
            })
        }
        if(interaction.isSelectMenu('support')) {
            if (interaction.values.includes('récompense')) {
                interaction.guild.channels.create(`🎉│${interaction.user.username}#${interaction.user.discriminator}`, {
                    type: 'text',
                    parent: cConfig.recompense_support,
                    permissionOverwrites: [{
                        id: interaction.member.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: ['MANAGE_CHANNELS']
                    },
                    {
                        id: interaction.guild.roles.everyone.id,
                        allow: [],
                        deny: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                    },
                    {
                        id: roles.helpeur,
                        allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: []
                    },
                    {
                        id: roles.TeamModo,
                        allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
                        deny: []
                    }
                    ],
                }).then(async ticket => {
                    interaction.reply({ content: `Votre ticket a été ouvert dans <#${ticket.id}>`, ephemeral: true })

                    // const close = new Discord.MessageActionRow()
                    //     .addComponents(
                    //         new Discord.MessageButton()
                    //             .setCustomId('close')
                    //             .setLabel('🔒')
                    //             .setStyle('SECONDARY'),
                    //     );
                    const suppr = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId('delete')
                                .setStyle('DANGER')
                                .setEmoji('🗑️')
                        );
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Ticket de <@&${interaction.member.id}>`)
                        .setDescription(`Veuillez indiquer ce que vous avez gagné, un <@&${roles.helpeur}> vous prendra en charge.`)
                        .setFooter(`Support|${interaction.guild.name}`)
                    ticket.send({ content: `${interaction.member}<@&${roles.helpeur}><@&${roles.TeamModo}>`, embeds: [embed], components: [suppr] })

                })
            }
            if (interaction.values.includes('support')) {
                interaction.guild.channels.create(`❓│${interaction.user.username}#${interaction.user.discriminator}`, {
                    type: 'text',
                    parent: cConfig.support_support,
                    permissionOverwrites: [{
                        id: interaction.member.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: ['MANAGE_CHANNELS']
                    },
                    {
                        id: interaction.guild.roles.everyone.id,
                        allow: [],
                        deny: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: roles.helpeur,
                        allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: []
                    },
                    {
                        id: roles.TeamModo,
                        allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
                        deny: []
                    }
                    ],
                }).then(async ticket => {
                    interaction.reply({ content: `Votre ticket a été ouvert dans <#${ticket.id}>`, ephemeral: true })

                    // const close = new Discord.MessageActionRow()
                    //     .addComponents(
                    //         new Discord.MessageButton()
                    //             .setCustomId('close')
                    //             .setLabel('🔒')
                    //             .setStyle('SECONDARY'),
                    //     );
                    const suppr = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId('delete')
                                .setStyle('DANGER')
                                .setEmoji('🗑️')
                        );
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Ticket de <@&${interaction.member.id}>`)
                        .setDescription(`Veuillez expliquer votre problème, un <@&963008192877588510> vous prendra en charge.`)
                        .setFooter(`Support|${interaction.guild.name}`)
                    ticket.send({ content: `${interaction.member}<@&${roles.helpeur}><@&${roles.TeamModo}>`, embeds: [embed], components: [suppr] })
                })
            }
            if (interaction.values.includes('partners')) {
                let general = interaction.guild.channels.create(`🤝│${interaction.member.user.username}#${interaction.member.user.discriminator}`, {
                    type: 'text',
                    parent: cConfig.partners_support,
                    permissionOverwrites: [{
                        id: interaction.member.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: ['MANAGE_CHANNELS']
                    },
                    {
                        id: interaction.guild.roles.everyone.id,
                        allow: [],
                        deny: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: roles.helpeur,
                        allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: []
                    },
                    ],
                }).then(ticket => {
                    interaction.reply({ content: `Votre ticket a été ouvert dans <#${ticket.id}>`, ephemeral: true })

                    // const close = new Discord.MessageActionRow()
                    //     .addComponents(
                    //         new Discord.MessageButton()
                    //             .setCustomId('close')
                    //             .setLabel('🔒')
                    //             .setStyle('SECONDARY'),
                    //     );
                    const suppr = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId('delete')
                                .setStyle('DANGER')
                                .setEmoji('🗑️')
                        );
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Ticket de <@&${interaction.member.id}>`)
                        .setDescription(`Salut ! Tu veut faire un partenariat ou un giveaway ? Check les <#${cConfig.prix}> nous te guiderons pour la suite`)
                        .setFooter(`Support|${interaction.guild.name}`)
                    ticket.send({ content: `${interaction.member}<@&${roles.helpeur}>`, embeds: [embed], components: [suppr] })
                })
            }
            if (interaction.values.includes('grade')) {
                let general = interaction.guild.channels.create(`🌟│${interaction.member.user.username}#${interaction.member.user.discriminator}`, {
                    type: 'text',
                    parent: cConfig.grades_support,
                    permissionOverwrites: [{
                        id: interaction.member.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: ['MANAGE_CHANNELS']
                    },
                    {
                        id: interaction.guild.roles.everyone.id,
                        allow: [],
                        deny: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: roles.helpeur,
                        allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: []
                    },
                    {
                        id: roles.TeamVente,
                        allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
                        deny: []
                    }
                    ],
                }).then(ticket => {
                    interaction.reply({ content: `Votre ticket a été ouvert dans <#${ticket.id}>`, ephemeral: true })

                    // const close = new Discord.MessageActionRow()
                    //     .addComponents(
                    //         new Discord.MessageButton()
                    //             .setCustomId('close')
                    //             .setLabel('🔒')
                    //             .setStyle('SECONDARY'),
                    //     );
                    const suppr = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId('delete')
                                .setStyle('DANGER')
                                .setEmoji('🗑️')
                        );
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Ticket de <@&${interaction.member.id}>`)
                        .setDescription(`Salut ! Tu veut acheter un grade ? Tu a consulté les <#${cConfig.grades}> ? C'est ici !`)
                        .setFooter(`Support|${interaction.guild.name}`)
                    ticket.send({ content: `${interaction.member}<@&${roles.helpeur}><@&${roles.TeamVente}>`, embeds: [embed], components: [suppr] })
                })
            }
            if (interaction.values.includes('enchère')) {
                let general = interaction.guild.channels.create(`💸┃${interaction.member.user.username}#${interaction.member.user.discriminator}`, {
                    type: 'text',
                    parent: cConfig.partners_support,
                    permissionOverwrites: [{
                        id: interaction.member.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: ['MANAGE_CHANNELS']
                    },
                    {
                        id: interaction.guild.roles.everyone.id,
                        allow: [],
                        deny: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: roles.helpeur,
                        allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: []
                    },
                    {
                        id: roles.TeamVente,
                        allow: ['MANAGE_CHANNELS', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
                        deny: []
                    }
                    ],
                }).then(ticket => {
                    interaction.reply({ content: `Votre ticket a été ouvert dans <#${ticket.id}>`, ephemeral: true })

                    // const close = new Discord.MessageActionRow()
                    //     .addComponents(
                    //         new Discord.MessageButton()
                    //             .setCustomId('close')
                    //             .setLabel('🔒')
                    //             .setStyle('SECONDARY'),
                    //     );
                    const suppr = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId('delete')
                                .setStyle('DANGER')
                                .setEmoji('🗑️')
                        );
                    const embed = new discord.MessageEmbed()
                        .setTitle(`Ticket de ${interaction.member}`)
                        .setDescription(`Salut ! Tu veut poster une enchère ? C'est ici !                    `)
                        .setFooter(`Support|${interaction.guild.name}`)
                    ticket.send({ content: `${interaction.member}<@&${roles.helpeur}><@&${roles.TeamVente}>`, embeds: [embed], components: [suppr] })
                })
            }
        }
    }
}