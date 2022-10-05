module.exports = {
    name: 'inviteCreate',
    once: false,
    execute(client, guildInvites, invite) {
        guildInvites.set(invite.guild.id, invite.guild.invites.fetch())
    }
}