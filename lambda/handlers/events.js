const Alexa = require('alexa-sdk');
const DaysHandler = require('./days');
const Utils = require('./utils');
const STATE = 'ChooseEvents';

exports.STATE = STATE;
exports.handler = Alexa.CreateStateHandler(STATE, {
    'PromptEvent': function() {
        const eventInfo = Utils.eventInfoFromContext(this);
        this.emit(':ask', `${eventInfo.title} is happening at ${eventInfo.venue}. Are you interested?`);
    },
    'AbortDay': function() {
        Utils.incrementDay(this);
        this.handler.state = DaysHandler.STATE;
        this.emitWithState('PromptDay');
    },
    'AMAZON.YesIntent': function() {
        // Get more detail and send card?
    },
    'AMAZON.NoIntent': function() {
        // Increment to the next event (if there is one)
        Utils.incrementEvent(this);
        this.emitWithState('PromptEvent');
    },
    'AMAZON.NextIntent': function() {
        // Pretty sure this is right...
        this.emitWithState('AbortDay');
    },
    'AMAZON.PreviousIntent': function() {
        // TODO: handle if
        Utils.decrementEvent(this);
        this.emitWithState('PromptEvent');
    },
    'AMAZON.CancelIntent': function () {
        this.emitWithState('AbortDay');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Okay, have a great week!');
    },
    'Unhandled': function() {
        const eventInfo = Utils.eventInfoFromContext(this);
        this.emit(':ask', `Are you interested in ${eventInfo.title}?  Answer yes or no?`);
    }
});