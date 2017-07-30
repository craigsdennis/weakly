const Alexa = require('alexa-sdk');
const EventsHandler = require('./events');
const PreferencesHandler = require('./preferences');
const Utils = require('./utils');
const STATE = 'ChooseDays';


exports.STATE = STATE;
exports.handler = Alexa.CreateStateHandler(STATE, {
    'PromptDay': function() {
        const dayInfo = Utils.dayInfoFromContext(this);
        this.emit(':ask', `There are ${dayInfo.count} events happening on ${dayInfo.friendlyDay}. Are you interested?`);
    },
    'AMAZON.YesIntent': function() {
        // Set state to event choosing
        this.handler.state = EventsHandler.STATE;
        this.emitWithState('PromptEvent');
    },
    'AMAZON.NoIntent': function() {
        // TODO: handle if
        Utils.incrementDay(this);
        this.emitWithState('PromptDay');
    },
    'AMAZON.PreviousIntent': function() {
        // TODO: handle if
        Utils.decrementDay(this);
        this.emitWithState('PromptDay');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Have a good week!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Okay, have a great week!');
    },
    'Unhandled': function() {
        Utils.debug(this, 'Unhandled request');
        Utils.forwardIfRelated(this, PreferencesHandler, () => {
            const dayInfo = Utils.dayInfoFromContext(this);
            this.emit(':ask', `Are you interested in events on ${dayInfo.friendlyDay}?  Answer yes or no?`);
        });
    }
});