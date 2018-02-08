require('dotenv').config()

var restify = require('restify');
var builder = require('botbuilder');

var server = new restify.createServer();
server.listen(3978, function(){
    console.log("%s Ouvindo no %s", server.name, server.url);
})
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
  })
  
var bot = new builder.UniversalBot(connector);
bot.set('storage', new builder.MemoryBotStorage());         
server.post('/api/messages', connector.listen());

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

var intents = new builder.IntentDialog({ recognizers: [recognizer] })
.matches('Sobre', (session) => {
    session.send('Olá! Eu sou um bot que faz cotação de moedas');
})
.matches('Cumprimento', (session) => {
    session.send('Olá, em que posso ajudar?', session.message.text);
})
.matches('Cotação', (session,args, next) => {
    var moedas = builder.EntityRecognizer.findAllEntities(args.entities, 'moeda');
    var message = moedas.map(m => m.entity).join(', ');
    session.send(`Eu farei uma cotação para as moedas **${message}**`);
})
.matches('None', (session) => {
    session.send('You reached None    intent, you said \'%s\'.', session.message.text);
})
.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

bot.dialog('/', intents);  

