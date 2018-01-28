var builder = require('botbuilder');
var restify = require('restify');
var create = require('./create');
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector, [
    function (session) {
        builder.Prompts.choice(session, 'What card would like to test?', create.CardNames, {
            maxRetries: 3,
            retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
        });
    },
    function (session, results) {

        // create the card based on selection
        var selectedCardName = results.response.entity;
        var card = create.Card(selectedCardName, session);

        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    }
]);
server.post('/api/messages', connector.listen())

