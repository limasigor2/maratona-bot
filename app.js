var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Crie um chat conector para se comunicar com o Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Endpoint que irá monitorar as mensagens do usuário
server.post('/api/messages', connector.listen());

// Recebe as mensagens do usuário e responde repetindo cada mensagem (prefixado com 'Você disse:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Você disse: %s", session.message.text);
});


var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Você disse: %s", session.message.text);
});
