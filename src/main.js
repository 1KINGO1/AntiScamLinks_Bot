'use strict'

const { Client, Intents } = require("discord.js");
const parseLink = require("./utils/parseLink.js");
const checkLink = require("./utils/checkLink.js");
const fs = require("fs");
const path = require("path");
const colors = require("colors");

let token = null;
let middleware = [];
let options = null;

const possibleOptions = {
    "cssChecker": "bool",
    "websiteIconChecker": "bool",
    "inSiteBlackWordsList": "array",
    "inSiteTitleBlackWordsList": "array",
    "blackListWords": "array"
}

// log functions
function error(mes){
    console.log("[ " + "ERROR".red + " ] " + mes);
}
function middleWareLoaded(middleware){
    console.log("[ " + "MIDDLEWARE".green + " ] " + middleware.yellow + " loaded")
}
function optionsLog(option, value){
    let posOpt = Object.keys(possibleOptions);
    if (!posOpt.some((elem) => option === elem)){
        error("Unknown property " + option.red);
        return false;
    }
    if (possibleOptions[option] === "array"){
        if ((!Array.isArray(value) && typeof value !== "boolean") || (typeof value === 'boolean' && value)){
            error("Incorrect type of " + option.red + " (must be false or array)");
            return false;
        }
        else{
            console.log("[ " + "OPTIONS".green + " ] " + `${option}`.yellow + " with value: " + `${typeof value === "boolean" ? value ? `${value}`.green : `${value}`.red : "[ ".green + `${value.join(" ")}`.green + " ]".green}`)
        }
    }
    if (possibleOptions[option] === "bool"){
        if (typeof value !== "boolean"){
            error("Incorrect type of " + `${option}`.red + " (must be boolean)");
            return false;
        }
        else{
            console.log("[ " + "OPTIONS".green + " ] " + `${option}`.yellow + " with value: " + `${value ? `${value}`.green : `${value}`.red}`)
        }
    }
}
function botLog(message){
    console.log("[ " + "BOT".green + " ] " + message)
}

//parsing config and applying middleware, then starting bot
!async function(){
    console.clear()
    let read = fs.readFileSync(path.dirname(__dirname) + "/config.json", 'utf-8');
    const config = JSON.parse(read);
    token = config.TOKEN;
    options = config.checkOptions;
    //logging config
    for (let field in options){
        optionsLog(field, options[field])
    }
    //getting middleware
    middleware = await Promise.all(config.middleware.map(async (elem, index) =>
        {
            try{
                let req = require(elem);
                middleWareLoaded(elem)
                return req;
            }
            catch (e) {
                error(elem.red + " invalid link!");
                return function(){}
            }
        }
    ));

}().then(() => client.login(token)).catch(() => {
    error(`Incorrect bot ` + "token".red)
})

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    botLog(`Bot login as ` + `${client.user.tag}`.green)
});

client.on('messageCreate', async (message) => {
    //Array of message words
    try{
        let content = message.content.toLowerCase()
        if (options.blackListWords.some((elem) => content.includes(elem.toLowerCase()))){
            middleware.forEach(mw => mw(message));
            return;
        }
    }catch (e) {}
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