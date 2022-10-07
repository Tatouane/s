const Discord = require('discord.js');
const config = require('./botconfig/config.json');
const ms = require('ms');
const giveaways = require('./giveaways.json');
const db = require('quick.db');
const gw = require('discord-giveaways')
const Server = require("discord-giveaways-dashboard").Server;
const guildInvites = new Map()
const cConfig = require('./botconfig/channelsConfig.json')

//------------------Creating Bot--------------------
const client = new Discord.Client({ intents: 32767 });
const manager = new gw.GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: 'RED',
        embedColorEnd: 'RED',
        reaction: '🎉'
    }
});
client.giveawaysManager = manager;

//------------------Handlers--------------------
['commands', 'buttons', 'selects'].forEach(x => client[x] = new Discord.Collection());
['CommandUtil', 'EventUtil', 'ButtonUtil', 'SelectUtil'].forEach(handler => { require(`./utils/handlers/${handler}`)(client) });
require('./utils/functions')(client);

//---connecting the bot----
client.login(process.env.TOKEN);
const invites = new Discord.Collection();
const wait = require("timers/promises").setTimeout;

client.on("ready", async () => {
    await wait(1000);
    client.guilds.cache.forEach(async (guild) => {
        const firstInvites = await guild.invites.fetch();
        invites.set(guild.id, new Discord.Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
    });
});
client.on("inviteDelete", (invite) => {
    invites.get(invite.guild.id).delete(invite.code);
});
client.on("inviteCreate", (invite) => {
    invites.get(invite.guild.id).set(invite.code, invite.uses);
});
client.on("guildCreate", (guild) => {
    guild.invites.fetch().then(guildInvites => {
        invites.set(guild.id, new Map(guildInvites.map((invite) => [invite.code, invite.uses])));
    })
});
client.on("guildDelete", (guild) => {
    invites.delete(guild.id);
});
client.on("guildMemberAdd", async (member) => {
    if (member.user.bot) return;
    const newInvites = await member.guild.invites.fetch()
    const oldInvites = invites.get(member.guild.id);
    const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
    const logChannel = member.guild.channels.cache.find(channel => channel.id === "976843602942627870");
    if (!db.has(`invites_${invite.inviter.id}`)) db.set(`invites_${invite.inviter.id}`, { total: 1, joined: 1, leave: 0, bonus: 0 })
    db.add(`invites_${invite.inviter.id}.total`, 1)
    db.add(`invites_${invite.inviter.id}.joined`, 1)
    logChannel.send(`${member.user.tag} joined using invite code ${invite.code} from ${invite.inviter}. Invite was used ${invite.uses} times since its creation.`)
});

manager.on('giveawayEnded', (giveaway, winners) => {
    winners.forEach(member => {
        member.send(`Vous avez gagné ce [giveaway](${giveaway.messageURL})`)
        member.roles.add('966791450299871342')
    })
})

const server = new Server(manager, {
    PORT: 1248,
    USERNAME: "Tatouane",
    PASSWORD: "1234"
});

server.on("ready", () => {
    console.log(`Server started at PORT *${server.PORT}`);
});

server.createServer();

client.on('interactionCreate', interaction => {
    if (interaction.customId === "commandes") {
        const form = new Discord.Modal()
            .setTitle('Commander')
            .setCustomId('commander')
        // const choice = new Discord.MessageSelectMenu()
        //     .setCustomId('category')
        //     .setPlaceholder('Catégorie de votre commande')
        //     .addOptions(
        //         {
        //             label: 'Mineur',
        //             description: 'Commander dans la catégorie mineur',
        //             value: 'mineur',
        //             emoji: '🔧',
        //         },
        //         {
        //             label: 'Hunter',
        //             description: 'Commander dans la catégorie hunter',
        //             value: 'hunter',
        //             emoji: '🥩',
        //         },
        //         {
        //             label: 'Alchimiste',
        //             description: 'Commander dans la catégorie alchimiste',
        //             value: 'alchimiste',
        //             emoji: '🧪',
        //         },
        //         {
        //             label: 'Farmer',
        //             description: 'Commander dans la catégorie farmer',
        //             value: 'farmer',
        //             emoji: '🌽',
        //         },
        //         {
        //             label: 'Quête de faction',
        //             description: 'Commander dans la catégorie quête de faction',
        //             value: 'faction',
        //             emoji: '⛩',
        //         },
        //     )
        const item = new Discord.TextInputComponent()
            .setCustomId('item')
            .setLabel("Item/service")
            .setStyle('SHORT')
            .setRequired(true)
            .setPlaceholder("Paladium ore");
        const prix = new Discord.TextInputComponent()
            .setCustomId('prix')
            .setLabel("Prix affiché dans le catalogue")
            .setPlaceholder("15000")
            .setStyle('SHORT')
            .setRequired(true);
        const quantité = new Discord.TextInputComponent()
            .setCustomId('quantite')
            .setLabel("Quantité")
            .setPlaceholder("5")
            .setStyle('SHORT')
            .setRequired(true);
        const pseudo = new Discord.TextInputComponent()
            .setCustomId('pseudo')
            .setLabel("Pseudo IG")
            .setPlaceholder("Tatouane69")
            .setStyle('SHORT')
            .setMinLength(3)
            .setMaxLength(16)
            .setRequired(true);

        // const q1 = new Discord.MessageActionRow().addComponents(choice);
        const q2 = new Discord.MessageActionRow().addComponents(item);
        const q3 = new Discord.MessageActionRow().addComponents(prix);
        const q4 = new Discord.MessageActionRow().addComponents(quantité);
        const q5 = new Discord.MessageActionRow().addComponents(pseudo);

        form.addComponents(q2, q3, q4, q5);
        interaction.showModal(form);
    }

    if (interaction.isModalSubmit() && interaction.customId === "commander") {
        interaction.guild.channels.create(interaction.member.user.tag, {
            parent: cConfig.commandes,
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: interaction.member.id,
                    allow: ["SEND_MESSAGES", "ADD_REACTIONS"],
                    deny: ["CHANGE_NICKNAME", "SEND_TTS_MESSAGES"]
                },
                {
                    id: interaction.guild.roles.everyone.id,
                    allow: ["SEND_MESSAGES", "ADD_REACTIONS"],
                    deny: ["VIEW_CHANNEL"]
                }
            ]
        }).then(ticket => {
            let embed = new Discord.MessageEmbed()
                .setTitle(`Commande de ${interaction.member.user.tag}`)
                .setColor('RED')
                .setDescription(`Item: \`${interaction.fields.getTextInputValue('item')}\`\nPrix unitaire: \`${interaction.fields.getTextInputValue('prix')}$\`\nQuantité: \`${interaction.fields.getTextInputValue('quantite')}\`\nPrix total: \`${interaction.fields.getTextInputValue('prix') * interaction.fields.getTextInputValue('quantite')}\`\nPseudo IG: \`${interaction.fields.getTextInputValue('pseudo')}\`\nStatut: 🕐 En attente`)
            ticket.send({ embeds: [embed] }).then(msg =>{
                db.set(`commande_${ticket.id}`, {take: false, client: interaction.member.user.username, embed: msg.id, item: interaction.fields.getTextInputValue('item'), prix: interaction.fields.getTextInputValue('prix'), quantity: interaction.fields.getTextInputValue('quantite'), pseudo: interaction.fields.getTextInputValue('pseudo')})
            })
        })
    }
})
