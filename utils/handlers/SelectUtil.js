const config = require('../../botconfig/config.json')
const {promisify} = require('util');
const {glob} = require('glob');
const { SlashCommandStringOption } = require('@discordjs/builders');
const pGlob = promisify(glob);

module.exports = async client =>{
    (await pGlob(`${process.cwd()}/selects/*.js`)).map(async selectFile =>{
        const slt = require(selectFile)
        if(!slt.customID){
            console.warn(`Select menu non fonctionnel: pas de nom ${selectFile}`)
        }
        client.selects.set(slt.customID, slt)
    })
}