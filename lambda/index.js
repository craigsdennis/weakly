'use strict';

const Alexa = require('alexa-sdk');
const DaysHandler = require('./handlers/days');
const EventsHandler = require('./handlers/events');
const Events = require('./events');
const APP_ID = 'amzn1.ask.skill.873c55a7-62d8-4150-9018-42c6554b7d6e';

const handlers = {
     // This will short-cut any incoming intent or launch requests and route them to this handler.
    'NewSession': function() {
        // Check if it's the first time the skill has been invoked
        this.handler.state = DaysHandler.STATE;
        if (Object.keys(this.attributes).length === 0) {
            // Set up defaults
            this.attributes['eventChoiceIndex'] = [0, 0];
            this.attributes['endedSessionCount'] = 0;
            Events.countsForWeek(Events.testData.lat, Events.testData.long).then(results => {
                this.attributes['events'] = results;
                this.emitWithState('PromptDay');
            }).catch(err => {
                console.error(err);
            });

        } else {
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
        this.emit(':tell', 'Unhandled event bro');
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context);
    //alexa.appId = APP_ID;
    alexa.dynamoDBTableName = 'WeaklySessions';
    alexa.registerHandlers(handlers, DaysHandler.handler, EventsHandler.handler);
    alexa.execute();
};
