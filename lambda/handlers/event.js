const Alexa = require('alexa-sdk');
const EventsHandler = require('./events');
const Utils = require('./utils');
const STATE = 'EventDetail';

exports.STATE = STATE;
exports.handler = Alexa.CreateStateHandler(STATE, {
    'DisplayEvent': function() {
        const event = Utils.currentEventFromContext(this);
        const dayInfo = Utils.dayInfoFromContext(this);
        const msg = `${event.title} is happening at ${event.startTime} at ${event.venue}.
            Check your Alexa app for more info.
            Would you like to hear more events for ${dayInfo.friendlyDay}?`;
        const cardTitle = `${event.title}`;
        const cardBody = `${event.url}
            ${event.venue}
            ${event.startTime}
        `;
        this.emit(':askWithCard', msg, msg, cardTitle, cardBody);
    },
    'AMAZON.YesIntent': function() {
        // Increment to the next event (if there is one)
        Utils.incrementEvent(this);
        this.handler.state = EventsHandler.STATE;
        this.emitWithState('PromptEvent');
    },

    'AMAZON.NoIntent': function() {
        // Increment to the next event (if there is one)
        this.handler.state = EventsHandler.STATE;
        this.emitWithState('AbortDay');
    },



});