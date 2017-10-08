const Alexa = require('alexa-sdk');
const Events = require('../events');
const EventsHandler = require('./events');
const PreferencesHandler = require('./preferences');
const Utils = require('./utils');
const STATE = 'EventDetail';

exports.STATE = STATE;
exports.handler = Alexa.CreateStateHandler(STATE, {
    'DisplayEvent': function() {
        const currentEvent = Utils.currentEventFromContext(this);
        const dayInfo = Utils.dayInfoFromContext(this);
        Events.getEventById(currentEvent.id).then(event => {
            console.dir(event);
            const msg = `${event.title} is happening at ${event.start_time} at ${event.venue_name}.
                Check your Alexa app for more info.
                Would you like to hear more events for ${dayInfo.friendlyDay}?`;
            const cardTitle = `${event.title}`;
            const cardBody = `${event.url}
                ${event.venue_name}
                ${event.start_time}
            `;
            this.emit(':askWithCard', msg, msg, cardTitle, cardBody);
        })
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

    'Unhandled': function() {
        Utils.debug(this, 'Unhandled request');
        Utils.forwardIfRelated(this, PreferencesHandler, () => {
            const dayInfo = Utils.dayInfoFromContext(this);
            this.emit(':ask', `Are you interested in more events on ${dayInfo.friendlyDay}?  Answer yes or no?`);
        });
    }
});