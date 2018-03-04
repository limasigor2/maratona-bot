require('dotenv').config();

const moment = require('moment')
var restify = require('restify');
var builder = require('botbuilder');

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

function saudacao(){
    const split_afternoon = 12;
    const split_evening = 17;
    const hora_atual = parseFloat(moment().utc().format('HH'));
    if(hora_atual < split_afternoon)
        return "Bom dia";
    if(hora_atual > split_evening)
        return "Boa noite";
    return "boa tarde";
}

// LUIS AI

const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
const intents = new builder.IntentDialog({
    recognizers: [recognizer]
});

intents.matches('None', (session, args, next) => {
    session.send('**( ͡° ͜ʖ ͡°)** - Desculpe, mas não entendi o que você quis dizer.\n\nLembre-se que sou um bot e meu conhecimento é limitado.')
});

intents.matches('saudar', (session, args, next) => {
    session.send(`${saudacao()}! Em que posso ajudar?`)
});

intents.onDefault((session, args) => {
    session.send(`Desculpe, não pude compreender **${session.message.text}**\n\nLembre-se que sou um bot e meu conhecimento é limitado.`)
});

bot.dialog('/', intents);