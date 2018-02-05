var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')

var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector, [
    function(session){
        session.send("Welcome to Dinner Reservation");
        session.beginDialog('askForDateTime');
    },
    function(session, results){
        session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
        session.beginDialog('askForPartySize');
    },
    function(session, results){
        session.dialogData.partySize = results.response;
        session.beginDialog('askForReserverName');
    },
    function(session, results){
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
]).set('storage', inMemoryStorage);


bot.dialog('askForDateTime', [
    function(session){
        builder.Prompts.time(session, "Por favor, informe a data e a hora da reserva");
    },
    function(session, results){
        session.endDialogWithResult(results);
    }
]);

bot.dialog('askForPartySize',[
    function(session){
        builder.Prompts.text(session, "Quantas pessoas na sua festa?")
    },
    function(session, results){
        session.endDialogWithResult(results);
    }
]);

bot.dialog('askForReserverName', [
    function(session){
        builder.Prompts.text(session, "Qual o nome do reservante?")
    },
    function(session, results){
        session.endDialogWithResult(results);
    }
]);