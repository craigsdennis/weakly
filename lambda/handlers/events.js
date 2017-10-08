const Alexa = require('alexa-sdk');
const Events = require('../events');
const DaysHandler = require('./days');
const EventHandler = require('./event');
const PreferencesHandler = require('./preferences');
const Utils = require('./utils');
const STATE = 'ChooseEvents';

exports.STATE = STATE;
exports.handler = Alexa.CreateStateHandler(STATE, {
    'PromptEvent': function() {
        const dayInfo = Utils.dayInfoFromContext(this);
        const location = Utils.getLocationPreference(this);
        // Get events for this day on demand
        Events.searchDay(location, dayInfo.day, false, Utils.eventPageNumberFromContext(this)).then(results => {
            const eventInfo = results[0];
            Utils.setCurrentEvent(this, eventInfo);
            let prefix = '';
            if (Utils.isFirstEventForDay(this)) {
                prefix = 'After each event, tell me if you are interested by saying yes or no.';
            }
            this.emit(':ask', `${prefix} ${eventInfo.title}?`);
        });
    },

    'AbortDay': function() {
        Utils.incrementDay(this);
        this.handler.state = DaysHandler.STATE;
        this.emitWithState('PromptDay');
    },

    'AMAZON.YesIntent': function() {
        // Get more detail and send card?
        this.handler.state = EventHandler.STATE;
        this.emitWithState('DisplayEvent');
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
        Utils.debug(this, 'Unhandled request');
        Utils.forwardIfRelated(this, PreferencesHandler, () => {
            const eventInfo = Utils.currentEventFromContext(this);
            this.emit(':ask', `Are you interested in ${eventInfo.title}?  Answer yes or no?`);
        });
    }
});