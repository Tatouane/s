const config = require('../../botconfig/config.json')
const {promisify} = require('util');
const {glob} = require('glob');
const { SlashCommandStringOption } = require('@discordjs/builders');
const pGlob = promisify(glob);

module.exports = async client =>{
    (await pGlob(`${process.cwd()}/buttons/*.js`)).map(async buttonFile =>{
        const btn = require(buttonFile)
        console.log(btn.customID)
        if(!btn.customID){
            console.warn(`Bouton non fonctionnel: pas de nom ${buttonFile}`)
        }
        client.buttons.set(btn.customID, btn)
    })
}