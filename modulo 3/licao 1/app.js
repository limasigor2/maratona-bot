
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
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});

bot.on("typing", function(message){
    console.log(message);
});
bot.on("error", function(message){
    console.log("error: An error occured. Passed a JavaScript Error object.");
});
bot.on("lookupUser", function(message){
    console.log("The user is for an address is about to be looked up. Passed an IAddress object.");
});
bot.on("receive", function(message){
    console.log("An incoming message has been received. Passed an IEvent object.");
});
bot.on("incoming", function(message){
    console.log("An incoming message has been received and processed by middleware. Passed an IMessage object.");
});
bot.on("routing", function(message){
    console.log("An incoming message has been bound to a session and is about to be routed through any session middleware and then dispatched to the active dialog for processing. Passed a Session object");
});
bot.on("send", function(message){
    console.log("An outgoing message is about to be sent to middleware for processing. Passed an IMessage object.");
});
bot.on("outgoing", function(message){
    console.log("An outgoing message has just been sent through middleware and is about to be delivered to the users chat client");
});
bot.on("getStorageData", function(message){
    console.log(": The sessions persisted state data is being loaded from storage. Passed an IBotStorageContext object.");
});
bot.on("saveStorageData", function(message){
    console.log("The sessions persisted state data is being written to storage. Passed an IBotStorageContext object");
});
bot.on("conversationUpdate", function(message){
    console.log("Your bot was added to a conversation or other conversation metadata changed. Passed an IConversationUpdate object.");
});
bot.on("contactRelationUpdate", function(message){
    console.log("The bot was added to or removed from a user's contact list. Passed an IContactRelationUpdate object.");
});
bot.on("typing", function(message){
    console.log("The user or bot on the other end of the conversation is typing. Passed an IEvent object.");
});