var restify = require('restify');
var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Crie um chat conector para se comunicar com o Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

var bot = new builder.UniversalBot(connector);
// Register in-memory state storage
bot.set('storage', new builder.MemoryBotStorage());         
// Endpoint que irá monitorar as mensagens do usuário
server.post('/api/messages', connector.listen());

var recognizer = new cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: 'Seu knowledge base id - código na rota do POST',
    subscriptionKey: 'Sua subscription key - código no Ocp-Apim-Subscription-Key',
    top: 3});

var qnaMakerTools = new cognitiveservices.QnAMakerTools();
bot.library(qnaMakerTools.createLibrary());

var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
	recognizers: [recognizer],
	defaultMessage: 'Não consegui entender, tente reformular sua pergunta XD!',
    qnaThreshold: 0.5,
    feedbackLib: qnaMakerTools
 });
basicQnAMakerDialog.respondFromQnAMakerResult = function(session, qnaMakerResult){
    // salva a pergunta
    var question = session.message.text;
    session.conversationData.userQuestion = question;
    

    var isCardFormat = qnaMakerResult.answers[0].answer.includes(";");

    if(!isCardFormat){
        session.send(qnaMakerResult.answers[0].answer);
    }else if(qnaMakerResult.answers && qnaMakerResult.score >= 0.5){
        var qnaAnswer = qnaMakerResult.answers[0].answer;
        
        var qnaAnswerData = qnaAnswer.split(';');
        var title = qnaAnswerData[0];
        var description = qnaAnswerData[1];
        var url = qnaAnswerData[2];
        var imageURL = qnaAnswerData[3];

        var msg = new builder.Message(session)
        
        msg.attachments([
            new builder.HeroCard(session)
            .title(title)
            .subtitle(description)
            .images([builder.CardImage.create(session, imageURL)])
            .buttons([
                builder.CardAction.openUrl(session, url, "Learn More")
            ])
        ]);
}
session.send(msg).endDialog();


}
bot.dialog('/', basicQnAMakerDialog);