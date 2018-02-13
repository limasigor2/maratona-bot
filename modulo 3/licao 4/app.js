require('dotenv').config();

var request = require('request');
var restify = require('restify');
var builder = require('botbuilder');

var server = new restify.createServer();
server.listen(3978, function () {
    console.log("%s ouvindo no %s", server.name, server.url);
});

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
bot.set('storage', new builder.MemoryBotStorage());
server.post('/api/messages', connector.listen());

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

var intents = new builder.IntentDialog({recognizers : [recognizer]});

intents.matches('Sobre', (session) => {
    session.send('Olá, Eu sou um bot que faz cotação de moedas');
});

intents.matches('Cumprimento', (session) => {
    session.send("Olá em que posso ajudar?");
});


intents.matches('Cotação', (session, args, next) => {
    var moedas = builder.EntityRecognizer.findAllEntities(args.entities, 'moeda').map(m => m.entity).join(',');
    var endpoint = process.env.ENDPOINT + '' + moedas;
    console.log("moedas: ", moedas);
    //console.log('endPoint', endpoint);
    session.send('Aguarde um momento enquanto eu consulto a cotação das moedas.');
    request(endpoint, (error, response, body) => {
        if(error || !body){
            return session.send('Ocorreu algum erro, tente novamente mais tarde.');
        }
        var cotacoes = JSON.parse(body);
        session.send(cotacoes.map(m => `${m.nome}: ${m.valor}` ).join(', '))
    });
});



intents.matches('None', (session) => {
    session.send('Desculpe, eu não entendi o que você disse');
});

intents.onDefault((session)=>{
    session.send("Eu não entendi o que você disse, desculpe");
});

bot.dialog('/', intents);  
