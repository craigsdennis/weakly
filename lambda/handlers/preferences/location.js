const Alexa = require('alexa-sdk');
const Utils = require('../utils');
const PreferencesHandler = require('../preferences');
const STATE = 'ChooseLocationPreference';


exports.STATE = STATE;
exports.handler = Alexa.CreateStateHandler(STATE, {
    'NewSession': function () {
        // Root page
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'PromptLocation': function() {
        const location = Utils.getLocationPreference(this);
        let msg = 'In order to inform you of events, we need to know your location. For example say "Set location to Portland, Oregon"';
        if (location !== undefined) {
            msg = `Your current location is ${location}.  To change this, say something like "Set location to Portland, Oregon"`;
        }
        this.emit(':ask', msg);
    },

    'SetLocationPreferenceIntent': function() {
        const location = this.event.request.intent.slots.Location.value;
        Utils.setLocationPreference(this, location);
        this.handler.state = PreferencesHandler.STATE;
        this.emitWithState('PromptPreferences');
    },

    'AMAZON.HelpIntent': function () {
        this.emitWithState('PromptLocation');
    },

    'Unhandled': function() {
        const intent = this.event.request.intent;
        if (intent.name.includes('Preferences')) {
            this.handler.state = PreferencesHandler.STATE;
            return this.emitWithState(intent.name);
        } else {
            Utils.debug(this, 'Unhandled location');
            this.emitWithState('PromptLocation');
        }
    }

});
