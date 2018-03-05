const moment = require('moment')

exports.saudacao = () => {
    const split_afternoon = 12;
    const split_evening = 17;
    const currentHour = parseFloat(moment().utc().format('HH'))
    if(currentHour > split_evening){
        return 'Boa noite';
    }
    else if (currentHour < split_evening) {
        return 'Bom dia';
    }
    return 'Boa tarde';
};

exports.hasImageAttachment = (session) => {
    return session.message.attachments.length > 0 &&
            session.message.attachments[0].contentType.indefOf('image') !== -1;
};