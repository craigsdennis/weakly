const Alexa = require('alexa-sdk');
const Events = require('../events');
const EventsHandler = require('./events');
const Utils = require('./utils');
const STATE = 'ChooseDays';


exports.STATE = STATE;
exports.handler = Alexa.CreateStateHandler(STATE, {
    'PromptDay': function() {
        const dayInfo = Utils.dayInfoFromContext(this);
        this.emit(':ask', `There are ${dayInfo.count} events happening on ${dayInfo.friendlyDay}. Are you interested?`);
    },
    'AMAZON.YesIntent': function() {
        const dayInfo = Utils.dayInfoFromContext(this);
        const location = Utils.getLocationPreference(this);
        // Get events for this day on demand
        Events.searchDay(location, dayInfo.day).then(results => {
            Utils.updateListings(this, results);
            // Set state to event choosing
            this.handler.state = EventsHandler.STATE;
            this.emitWithState('PromptEvent');
        });
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
        const dayInfo = Utils.dayInfoFromContext(this);
        this.emit(':ask', `Are you interested in events on ${dayInfo.friendlyDay}?  Answer yes or no?`);
    }
});