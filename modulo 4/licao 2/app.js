require('dotenv').config();

var utils = require("../util/util.js");
const restify = require('restify');
const builder = require('botbuilder');



const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
   console.log('%s listening to %s', server.name, server.url); 
});

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);
bot.set('storage', new builder.MemoryBotStorage());         
server.post('/api/messages', connector.listen());


// LUIS AI

const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
const intents = new builder.IntentDialog({
    recognizers: [recognizer]
});

intents.matches('None', (session, args, next) => {
    session.send('**( ͡° ͜ʖ ͡°)** - Desculpe, mas não entendi o que você quis dizer.\n\nLembre-se que sou um bot e meu conhecimento é limitado.')
});

intents.matches('saudar', (session, args, next) => {
    session.send(`${utils.saudacao()}! Em que posso ajudar?`)
});

intents.onDefault((session, args) => {
    session.send(`Desculpe, não pude compreender **${session.message.text}**\n\nLembre-se que sou um bot e meu conhecimento é limitado.`)
});

bot.dialog('/', intents);