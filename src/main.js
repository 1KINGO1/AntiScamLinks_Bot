'use strict'

const { Client, Intents } = require("discord.js");
const parseLink = require("./utils/parseLink.js");
const checkLink = require("./utils/checkLink.js");
const fs = require("fs");
const path = require("path")

let token = null;
let middleware = [];
let options = null;

//parsing config and applying middleware, then starting bot
!async function(){
    let read = fs.readFileSync(path.dirname(__dirname) + "/config.json", 'utf-8');
    const config = JSON.parse(read);
    token = config.TOKEN;
    options = config.checkOptions;
    middleware = await Promise.all(config.middleware.map(async (elem, index) =>
        {
            try{
                return require(elem);
            }
            catch (e) {
                throw new Error(`Incorrect link to middleware ` + (index + 1));
            }
        }
    ));
}().then(() => client.login(token))

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    //Array of message words
    let messArr = message.content.split(' ');
    for (let word of messArr){
        //If the word is already a link
        if (word.includes('https://') || word.includes('http://')){
            //getting link from word
            let link = parseLink(word);
            //checking the link for scams
            let check = await checkLink(link, options);
            if (check){
                middleware.forEach(mw => mw(message));
            }
        }
        //else going to next word
    }
});