'use strict';

const Alexa = require('alexa-sdk');
const DaysHandler = require('./handlers/days');
const EventsHandler = require('./handlers/events');
const EventHandler = require('./handlers/event');
const Utils = require('./handlers/utils');
const PreferencesHandler = require('./handlers/preferences');
const LocationPreferenceHandler = require('./handlers/preferences/location');
const Events = require('./events');

const APP_ID = 'amzn1.ask.skill.873c55a7-62d8-4150-9018-42c6554b7d6e';

const handlers = {
     // This will short-cut any incoming intent or launch requests and route them to this handler.
    'NewSession': function() {
        // Check if it's the first time the skill has been invoked
        if (!Utils.isReady(this)) {
            this.handler.state = PreferencesHandler.STATE;
            this.emitWithState('PromptPreferences');
        // It's been used before, but hasn't gathered the events
        } else {
            this.emit('Begin');
        }
    },

    'Begin': function() {
        this.handler.state = DaysHandler.STATE;
        // Do we have our information?
        if (this.attributes.events === undefined) {
            Events.countsForWeek(this.attributes.preferences.location).then(results => {
                // Set up defaults
                this.attributes['eventChoiceIndex'] = [0, 0];
                this.attributes['endedSessionCount'] = 0;
                this.attributes['events'] = results;
                this.emit(':saveState');
                this.emitWithState('PromptDay');
            }).catch(err => {
                console.error(err);
            });
        } else {
            // Otherwise we've got our information
            this.emitWithState('PromptDay');
        }
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':askWithCard', 'I will let you know what is going on this week');
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Have a good week!');
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Okay, have a great week!');
    },

    'Unhandled': function() {
        Utils.debug(this, 'Unhandled root');
        this.emit(':tell', 'Unhandled event bro');
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context);
    //alexa.appId = APP_ID;
    alexa.dynamoDBTableName = 'WeaklySessions';
    alexa.registerHandlers(handlers,
        PreferencesHandler.handler,
        LocationPreferenceHandler.handler,
        DaysHandler.handler,
        EventsHandler.handler,
        EventHandler.handler
    );
    alexa.execute();
};
