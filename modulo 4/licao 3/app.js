require('dotenv').config();

const restify = require('restify');
const builder = require('botbuilder');
var utils = require("../util/util.js");

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

const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
const intents = new builder.IntentDialog({
    recognizers: [recognizer]
});

intents.matches('None', (session, args, next) => {
    session.send('Desculpe, mas não entendi o que você quis dizer.\n\nLembre-se que sou um bot e meu conhecimento é limitado.')
});

intents.matches('saudar', (session, args, next) => {
    session.send(`${utils.saudacao()}! Em que posso ajudar?`)
});

intents.matches('reconhecer-emoções', [
    (session, args, next) => {
    builder.Prompts.choice(session, 'Como você deseja enviar a imagem?', ['URL', 'Anexo'], {
        listStyle: builder.ListStyle.button
    });
    },
    (session, results) => {
        switch(results.response.index){
            case 1:
                builder.Prompts.attachment(session, 'Tudo pronto, então me envie o anexo');
                break;
            default:
                builder.Prompts.text(session, 'Tudo pronto, me envia uma URL');
                break
        }
    },
    (session, results) =>{
        if(utils.hasImageAttachment(session)){

        }else{
            
        }
    }
]);
intents.onDefault((session, args) => {
    session.send(`Desculpe, não pude compreender **${session.message.text}**\n\nLembre-se que sou um bot e meu conhecimento é limitado.`)
});

bot.on("conversationUpdate", (update)=>{
    if(update.membersAdded){
        update.membersAdded.forEach((identity)=>{
            if(identity.id == update.address.bot.id){
                bot.loadSession(update.address, (err, session)=>{
                    if (err)
                        return err;
                    const msg = 'Olá eu sou o **Bot Inteligentão**, olha o que posso fazer:\n\n'+
                        '* **Falar que nem gente**\n' +
                        '* **Descrever imagens**\n' +
                        '* **Reconhecer emoções**\n' +
                        '* **Classificar objetos**\n' +
                        '* **Traduzir textos**\n' +
                        '* **Recomendar produtos por item**\n' +
                        '* **Recomendar produtos para um determinado perfil**';
                    session.send(msg);
                })
            }
        });
    }
})
bot.dialog('/', intents);