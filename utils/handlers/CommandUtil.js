const config = require('../../botconfig/config.json')
const {promisify} = require('util');
const {glob} = require('glob');
const pGlob = promisify(glob);

module.exports = async client =>{
    (await pGlob(`${process.cwd()}/commands/*/*.js`)).map(async commandFile =>{
        const cmd = require(commandFile)
        try{
            if(!cmd.name){
                console.warn(`Commande non chargée: pas de nom ${commandFile}`)
            }
            if(!cmd.permissions){
                console.warn(`Commande non chargée: pas de permission ${commandFile}`)
            }
            if(!cmd.category){
                console.warn(`Commande non chargée: pas de catégorie ${commandFile}`)
            }
            cmd.permissions.forEach(permission => {
                if(!permissionList.includes(permission)){
                    console.warn(`Commande non chargée: ${permission} n'est pas une permission valide`)
                }
            })
            client.commands.set(cmd.name, cmd)
            console.log(`Commande chargée: ${cmd.name}`)
        }catch(e){
            console.warn(`Il y a eu une erreur lors du chargement des commandes: ${e}`)
        }
    })
}

const permissionList = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS_AND_STICKERS",
    "USE_APPLICATION_COMMANDS",
    "REQUEST_TO_SPEAK",
    "MANAGE_EVENTS",
    "MANAGE_THREADS",
    "USE_PUBLIC_THREADS",
    "CREATE_PUBLIC_THREADS",
    "USE_PRIVATE_THREADS",
    "CREATE_PRIVATE_THREADS",
    "USE_EXTERNAL_STICKERS",
    "SEND_MESSAGES_IN_THREADS",
    "START_EMBEDDED_ACTIVITIES",
    "MODERATE_MEMBERS",
];